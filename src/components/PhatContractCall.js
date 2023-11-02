import React, { useContext, useEffect, useState } from 'react';

// Phala sdk beta!!
// install with `yarn add @phala/sdk@beta`, v0.5.0
import { PinkContractPromise, OnChainRegistry, signCertificate } from '@phala/sdk'

import { AppContext } from "../context/ContextProvider";
import { PhalaApiContext } from '../context/PhalaApiProvider';

import metadata from "../lib/phat_contract_metadata.json";

import { Box } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import CircularProgress from '@mui/material/CircularProgress';

import dayjs from 'dayjs';

import { PHAT_CONTRACT_ID, PHALA_PROVIDER_ENDPOINTS, DEFAULT_NETWORKS } from "../lib/constants";

export function PhatContractCall(props) {

  const endpoint = DEFAULT_NETWORKS["phala"];
  const [contract, setContract] = useState();
  const [cert, setCert] = useState();
  const { pair, phatOk, setPhatOk, phatError, setPhatError, setQueryTime } = useContext(AppContext);
  const { api, setProvider, connectApi } = useContext(PhalaApiContext);

  useEffect(()=>{
    if (api) {
      loadContract()
      setQueryTime(dayjs().valueOf());
    }
  }, [api])
  
  const loadContract = async () => {
        try {
          const provider = PHALA_PROVIDER_ENDPOINTS[endpoint];
          setProvider(provider)
          
          // contract ID on phat-cb (contract address on polkadot.js.org/apps)
          //const contractId = "0xed1bf2be043050ed7b85c270b28d41d4f1b2baaee6e556dd049cc826876dd27c"
          const contractId = PHAT_CONTRACT_ID[endpoint];
         
          const phatRegistry = await OnChainRegistry.create(api)

          const abi = JSON.parse(JSON.stringify(metadata))
          const contractKey = await phatRegistry.getContractKey(contractId)

          console.log("contractKey",contractKey)
         
          const contract = new PinkContractPromise(api, phatRegistry, abi, contractId, contractKey)
          setContract(contract)
          const lcert = await signCertificate({ api, pair })
          console.log("certificat",lcert)
          console.log("pair",pair.address)
          setCert(lcert);

          console.log("contract:",contract.abi.messages.map((e)=>{return e.method}))
          console.log("Contract loaded successfully");

        } catch (err) {
          console.log("Error in contract loading",err);
          throw err;
        }
      
  };

  // query with sdk
  const feedPrices = async () => {
      console.log("feedPrices...")
      props.loading.setLoadingQuery(true);
      setQueryTime(dayjs().valueOf());
      try {
        const result = await contract.query.feedPrices(pair.address,{cert});
        console.log('result:', result.output.toHuman())
      if (result.output.toHuman().Ok?.Ok) {
        setPhatOk(result.output.toHuman().Ok.Ok)
        setPhatError(undefined)
      }
      else {
        setPhatError(result.output.toHuman().Ok?.Err)
        setPhatOk(undefined)
      }
      } catch (error) {
        console.log("Error in rollup: \"",error, "\" - Please try again")
        /*await connectApi();
        await loadContract();
        await feedPrices();
        */
      }
      props.loading.setLoadingQuery(false);
      
  }

  const message = phatOk ? "Query has been executed succesfully!" : phatError ? "Error during rollup query: "+phatError+" - Please try again" : "Click to send Rollup query";
  return (<>
        <Box display="flex" alignItems="center" justifyContent="left" >
            <SyncIcon 
              fontSize="large" 
              style={{cursor:'pointer'}} 
              disabled={!(contract)} 
              onClick={feedPrices} 
              color="success"
              sx={{display:props?.loading?.loadingQuery ? "none" : "inline-block"}}
            />
            <CircularProgress 
              onProgress={100}
              size="1.5rem"
              sx={{mx:0.7, my:0.67, display:props?.loading?.loadingQuery ? "inline-block" : "none"}} 
            />
            <Box sx={{ml:1.3}}>{message}</Box>
          
        </Box>

    </>)
};

