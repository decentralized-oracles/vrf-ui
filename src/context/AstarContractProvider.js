import React, { useState, useEffect, useContext } from "react";
import { Abi, ContractPromise } from "@polkadot/api-contract";
import { AstarApiContext } from "../context/AstarApiProvider";
import { AppContext } from "../context/ContextProvider";
import { ORACLE_CONTRACT_ABI_METADATA, ORACLE_CONTRACT_ADDRESS } from "../lib/constants";
import { formatAddress } from "../lib/formatAddress"
import { globalProcess } from "../lib/gobalProcess";
//import * as vrf_consumer from "../lib/vrf_consumer"
import BN from "bn.js"
import toast from 'react-hot-toast';

export const ContractContext = React.createContext();

export const AstarContractProvider = ({ children }) => {

  // Contexts
  const { api, network } = useContext(AstarApiContext);
  const { account, setAccount, setStep, step } = useContext(AppContext);

  // states
  const [contract, setContract] = useState();
  const [abi,setAbi] = useState();
  const [claimDryRunRes,setClaimDryRunRes] = useState(undefined)
  const [randomNumber, setRandomNumber] = useState({})

  useEffect(() => {
    if (api) loadVrfContract();
  }, [api]);
  
  const loadVrfContract = async () => {
    try { 
      const abi = new Abi(ORACLE_CONTRACT_ABI_METADATA[network], api.registry.getChainProperties());
      setAbi(abi)
      const contract = new ContractPromise(api, abi, ORACLE_CONTRACT_ADDRESS[network]);

      setContract(contract);

      setStep(0);
    } catch (error) {
      console.error("Error in VRFContract", error);
    }
  };

  const doDryRun = async () => {
    const min=0; // arbitraire, à changer avec des valeurs de formulaire
    const max=100; // arbitraire, à changer avec des valeurs de formulaire
    const abiIndex = 2 // request_random_value
    const { gasRequired, result, error } = await dryRun("requestRandomValue",abiIndex,min,max);
    
    const res = { gasRequired, result, error }
    //("res",result.asOk.data)
    setClaimDryRunRes(res)
    return res
  }

  const dryRun = async(funcName,abiIndex,...args)=>{
    //console.log("sending DryRun on "+network+" for contract: ",rewardManagerContract.address.toString())
    // Get the initial gas WeightV2 using api.consts.system.blockWeights['maxBlock']
    const gasLimit = api.registry.createType(
      'WeightV2',
      api.consts.system.blockWeights['maxBlock']
    )
    // Query the contract message
    // This will return the gas required and storageDeposit to execute the message
    // and the result of the message
    //(contract.query)
    const contractPromise = contract.query[funcName](
      account.address,
      {
        gasLimit: gasLimit,
        storageDepositLimit: null
      },
      ...args
    )
  
    const { gasRequired, storageDeposit, result } = await contractPromise;

    // Check for errors
    let error = undefined
    if (result.isErr) {
      if (result.asErr.isModule) {
        const dispatchError = api.registry.findMetaError(result.asErr.asModule)
        error = dispatchError.docs.length ? dispatchError.docs.concat().toString() : dispatchError.name
      } else {
        error = result.asErr.toString()
      }
    }

    // Even if the result is Ok, it could be a revert in the contract execution
    if (result.isOk) {
      const flags = result.asOk.flags.toHuman()
      // Check if the result is a revert via flags
      if (flags.includes('Revert')) {
        const type = contract.abi.messages[abiIndex].returnType // here 5 is the index of the message in the ABI
        const typeName = type?.lookupName || type?.type || ''
        error = contract.abi.registry.createTypeUnsafe(typeName, [result.asOk.data]).toHuman()
        error = error ? error.Ok.Err.toString() : 'Revert'
      }
    }
    console.log("DryRun error?:",error)
    return { gasRequired, storageDeposit, result, error }
  }

  const getEstimatedGas = (gasRequired) => {
      // Gas require is more than gas returned in the query
      // To be safe, we double the gasLimit.
      // Note, doubling gasLimit will not cause spending more gas for the Tx
      const BN_TWO = new BN(2);
      return api.registry.createType(
        'WeightV2',
        {
          refTime: gasRequired.refTime.toBn().mul(BN_TWO),
          proofSize: gasRequired.proofSize.toBn().mul(BN_TWO),
        }
      )
  }

  const doTx = async (funcName, ...args) => {
    const res = await doDryRun()
    const { gasRequired, result, error } = res
    //console.log("DRYRUNRES",gasRequired, result, error)
    
    if (error) {
      console.log("ERROR")
      toast.error(
        error,
        {position: 'bottom-right'}
      )
      return
    }
    
    setStep(1); // sending request...
    
    const txToast = toast.loading(
      'Sending Transaction...',
      {
        position: 'bottom-right',
      }
    );

    let txError = undefined;
    const tmpRandomNumber = {
      requestAddress: undefined,
      requestNonce: undefined,
      requestMin: undefined,
      requestMax: undefined,
      requestTime: undefined,
      randomNumber: undefined,
      responseTime: undefined
    };

    const unsubEvents = await api.query.system.events(events => 
      events.forEach(
        ({event}) => {
          if (event.data.contract?.toString()===ORACLE_CONTRACT_ADDRESS[network] && api.events.contracts.ContractEmitted.is(event) ) {
            //console.log(event)
            let decoded_event;
            try {
              decoded_event = abi.decodeEvent(event.data.data)
            } catch (error) {
              console.log(error)
            }
            const decoded_event_array = decoded_event.args.map((v,i)=>{return v.toHuman()})
            if (decoded_event_array[0] === formatAddress(account.address,network) && decoded_event_array.length === 5) {
                console.log("---> EVENT",event,decoded_event_array)
                tmpRandomNumber.requestAddress = decoded_event_array[0]
                tmpRandomNumber.requestNonce = decoded_event_array[1]
                tmpRandomNumber.requestMin = decoded_event_array[2]
                tmpRandomNumber.requestMax = decoded_event_array[3]
                tmpRandomNumber.requestTime = decoded_event_array[4]
                console.log("EVENT 1",tmpRandomNumber)
                setRandomNumber(tmpRandomNumber)

                setStep(3); // Query Phat contract
            }
            if (decoded_event_array[0] === formatAddress(account.address,network) && decoded_event_array.length === 4) {
              if ( tmpRandomNumber?.requestAddress === decoded_event_array[0] && tmpRandomNumber?.requestNonce === decoded_event_array[1] )
              {
                tmpRandomNumber.randomNumber = decoded_event_array[2]
                tmpRandomNumber.responseTime = decoded_event_array[3]
                setRandomNumber({...tmpRandomNumber})

                setStep(5); // VRF received... Success
                unsubEvents();
              }
            }
          }
        }
      )
    )

    const unsubTx = await contract.tx[funcName](
      {
        gasLimit: getEstimatedGas(gasRequired),
        storageDepositLimit: null
      },
      ...args
    )
    .signAndSend(
      account.address,
      (res) => {
        setStep(2)
        //console.log("RES.events",step,res)
        res.events.forEach(({ phase, event: { data, method, section } }) => {
          //console.log("EVENT FOREACH",res.status.toHuman(),section,method,data.toHuman())
          if (method === "ExtrinsicFailed") {
            txError = "ExtrinsicFailed"
          }
        });
        
        if (res.status.isInBlock) {
          toast.loading('Transaction is in block',{id:txToast});
        }
        if (res.status.isFinalized) {
          
          //console.log(res)
          toast.dismiss(txToast)
          let txMessage;
          if (txError) txMessage="Transaction Failed ("+txError+")"
          else txMessage="Transaction sent successfully"
          const toastValue = (t) => (
            <span className="toast-tx-result text-right">
              {txMessage}<br/><a target="_blank" href={"https://"+network+".subscan.io/extrinsic/"+res.txHash.toHex()}>show in Subscan</a>
              <button className="btn-tx-result" onClick={() => toast.dismiss(t.id)}> close </button>
            </span>
          )
          const toastOptions = {
            duration: 6000000,
            position: 'bottom-right',
            style: {maxWidth:600},
          }
          if (txError) toast.error(toastValue,toastOptions);
          else toast(toastValue,toastOptions);
          unsubTx()
      }
    }).catch((error) => {
      console.log(error)
      toast.dismiss(txToast)
      setStep(0)
      toast.error("Transaction Failed: "+error.toString(),{
        position: 'bottom-right',
        style: {maxWidth:600},
      });
    });     
    //}
  }

  return (
    <ContractContext.Provider
      value={{
        contract,
        doTx,
        doDryRun,
        dryRun,
        randomNumber
        //dryRunRes,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};