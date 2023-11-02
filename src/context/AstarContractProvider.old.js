import React, { useState, useEffect, useContext } from "react";
import { Abi, ContractPromise } from "@polkadot/api-contract";
import { AstarApiContext } from "./AstarApiProvider";
import { ORACLE_CONTRACT_ABI_METADATA, ORACLE_CONTRACT_ADDRESS } from "../lib/constants";

export const ContractContext = React.createContext();

export const AstarContractProvider = ({ children }) => {
  const { api, network } = useContext(AstarApiContext);
  const [oracleContract, setOracleContract] = useState();

  useEffect(() => {
    if (api) loadOracleContract();
  }, [api]);

  const loadOracleContract = async () => {
    try { 
      const abi = new Abi(ORACLE_CONTRACT_ABI_METADATA[network], api.registry.getChainProperties());
      const contract = new ContractPromise(api, abi, ORACLE_CONTRACT_ADDRESS[network]);
      
      setOracleContract(contract);
    } catch (error) {
      console.error("Error in loadOracleContract", error);
    }
  };

  // Specific function from contract
  const requestRandomValue = async(min,max)=>{
    // Get the initial gas WeightV2 using api.consts.system.blockWeights['maxBlock']
    const gasLimit = api.registry.createType(
      'WeightV2',
      api.consts.system.blockWeights['maxBlock']
    )

    const type = oracleContract.abi.messages[2].returnType // here 2 is the index of "getTradingPair" in the ABI
    const typeName = type?.lookupName || type?.type || ''

    // Query the contract message
    // This will return the gas required and storageDeposit to execute the message
    // and the result of the message
    const oracleContractPromise = oracleContract.query.requestRandomValue(
      null,
      {
        gasLimit: gasLimit,
        storageDepositLimit: null
      },
      min,
      max
    )
  
   const { gasRequired, storageDeposit, result } = await oracleContractPromise;

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
        error = oracleContract.abi.registry.createTypeUnsafe(typeName, [result.asOk.data]).toHuman()
        error = error ? error.Ok.Err.toString() : 'Revert'
      }
    }
    const data = oracleContract.abi.registry.createTypeUnsafe(typeName, [result.asOk.data]).toHuman()
    return { gasRequired, storageDeposit, result, data, error }
  }

  return (
    <ContractContext.Provider
      value={{
        oracleContract,
        requestRandomValue
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};