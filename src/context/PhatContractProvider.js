import React, { useState, useEffect, useContext } from "react";
import { PhalaApiContext } from "./PhalaApiProvider";
import { Keyring } from "@polkadot/api";
import { types } from "@phala/sdk";
import { PinkContractPromise, OnChainRegistry, signCertificate } from '@phala/sdk'
import vrf_oracle_phat from "../lib/vrf_oracle_phat.json";

export const PhatContractContext = React.createContext();

export const PhatContractProvider = ({ children }) => {

  const [vrf_phatContract,setContract]=useState()
  const [cert,setCert]=useState()
  const [pair,setPair]=useState()
  const {api} = useContext(PhalaApiContext)
  const [interruptPC,setInterruptPC] = useState()

  useEffect(()=>{
    // PHAT_TODO:Connect to contract
    if (!vrf_phatContract) {
      const connectContract = async ()=> {
        try {
          const pair = new Keyring({ type: 'sr25519' }).addFromUri("//Alice")
          setPair(pair)
          const contractId = "0xa6c5baac29ef1e1bdfd6a5d2172d5cd85e4351497f7bd2b1a33c8c7be8b53feb";
          
          const phatRegistry = await OnChainRegistry.create(api)
          const abi = JSON.parse(JSON.stringify(vrf_oracle_phat))
          const contractKey = await phatRegistry.getContractKey(contractId)
          //console.log("contractKey",contractKey)
          
          const contract = new PinkContractPromise(api, phatRegistry, abi, contractId, contractKey)
          setCert(await signCertificate({ api, pair }))
          setContract(contract)
          

          //console.log("certificate",cert)
          //console.log("pair",pair.address)
          //console.log("contract:",contract.abi.messages.map((e)=>{return e.method}))
          console.log("Phat Contract loaded successfully");
        } 
        catch (err) {
            console.log("Error in Phat contract loading",err);
            throw err;
        }
      }
      if (api) {
        connectContract()
      }
    }
  },[api])

  async function vrf_query_answerRequest() {
    if (api && vrf_phatContract) {
        let result;
        try {
            console.log("Phat QUERY answerRequest")
            result = await vrf_phatContract.query.answerRequest(pair.address,{cert});
            console.log('result:', result.output.toHuman())
            //let resultString = result.output.toHuman() as Object
            let res = result?.output?.toHuman()
        if (res?.Ok?.Ok) {
            console.log("Phat OK",res.Ok.Ok)
            return "OK"
        }
        else {
            console.log("Phat ERROR",res.Ok?.Err)
            //return "NoRequestInQueue"
            return res.Ok?.Err
        }
        
        } catch (error) {
            console.log("Error in rollup: \"",error, "\" - Please try again")
            return "Error"
        }
    }
  }
  const delay = ms => new Promise(res => setTimeout(res, ms));

  async function vrf_query_answerRequest_wait_NoRequestInQueue() {
    let result
    let nb = 0
    await delay(10000);
    
    while (result != "NoRequestInQueue" && nb < 20 && !interruptPC) {
      console.log("interruptPC",interruptPC)
      nb++
      console.log("Essai "+nb)
      result = await vrf_query_answerRequest()
    }
    if (result == 20) {
      return false
    }
    return true
  }

  return (
    <PhatContractContext.Provider
      value={{
        vrf_phatContract,
        vrf_query_answerRequest,
        vrf_query_answerRequest_wait_NoRequestInQueue,
        setInterruptPC
      }}
    >
      {children}
    </PhatContractContext.Provider>
  );
};