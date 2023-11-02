import React, { useEffect, useState, useContext } from "react";
import { Keyring } from '@polkadot/api'
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { setToStorage, getFromStorage } from "../lib/storage";
import { DAPP_NAME } from "../lib/constants"
import { AstarApiContext } from "./AstarApiProvider";
import { PhatContractContext } from "./PhatContractProvider";
import { globalProcess } from "../lib/gobalProcess";

export const AppContext = React.createContext();

export const ContextProvider = ({ children }) => {
  
  const astarApiContext = useContext(AstarApiContext)
  const { vrf_query_answerRequest_wait_NoRequestInQueue } = useContext(PhatContractContext)

  const [dappName, setDappName] = useState(DAPP_NAME);
  const [pair, setQueryPair] = useState();
  const [account, setStateAccount] = useState(undefined);
  
  const [processUpdate,setProcessUpdate] = useState(new Date().getMilliseconds())
  const [stepDef,setStepDef] = useState()
  const [step,setStateStep] = useState()
  const [previousStep,setPreviousStep] = useState()
  const [isStuck,setStuck] = useState(false)

  const setStep = (s)=> {
    const pstep=globalProcess.step
    setPreviousStep(globalProcess.step)
    if (!(s==2 && pstep!=1)) {
        console.log("___###___setStep",s)
        globalProcess.setStep(s);
        setStateStep(s)
        setProcessUpdate(new Date().getMilliseconds())
        console.log("STEP-------",globalProcess.step)
      }
  }

  useEffect(()=>{
    setStepDef(globalProcess.stepDefs[globalProcess.step])
  },[processUpdate])

  useEffect(()=>{
    let res
    const processStep3 = async () => {
      res = await vrf_query_answerRequest_wait_NoRequestInQueue()
      if (res === true) {
        setStep(4)
      }
      else {
        setStuck(true)
      }
    }
    if (globalProcess.isStep(3)) {
      processStep3()
    }
  },[processUpdate])

  let lsAccount = undefined;

  useEffect(()=>{
    const load = async () => {
      await cryptoWaitReady().catch(console.error);
      loadContext()
    }
    load().catch(console.error);
  },[])

  useEffect (()=>{
    const loadSigner = async () => {
      console.log("using account: "+account.address)
      const { getWalletBySource} = await import('@talismn/connect-wallets');
      //console.log(account.source)
      const injector = await getWalletBySource(account.source);
      //setStateWallet(injector);
        ("Wallet(injector)",injector)
      await injector.enable(dappName)
      astarApiContext.api.setSigner(injector.signer)
      
    }
    if (astarApiContext.api && account && account!== "undefined") loadSigner();
  },[account,astarApiContext.api]);
  
  const loadContext = () => {
    setQueryPair(new Keyring({ type: 'sr25519' }).addFromUri("//Alice"))
    lsAccount = getFromStorage("wallet-account",true)
    if (typeof lsAccount !== "undefined") {
      setStateAccount(lsAccount)
    }
  }
  
  const setAccount = (e) => {
    setToStorage("wallet-account",e,true)
    setStateAccount(e)
  }

  const getInjector = async (account) => {
      const { getWalletBySource} = await import('@talismn/connect-wallets');
      const injector = await getWalletBySource(account.source);
      await injector.enable(dappName)
      return injector
  }
    
  const getSigner = async (account) => {
      const injector = await getInjector(account)
      const signer = injector.signer;
      return signer;
  };

  return (
    <AppContext.Provider
      value={{
        account,
        setAccount,
        pair,  
        setQueryPair,
        getSigner,
        dappName, 
        setDappName,
        stepDef,
        isStuck,
        setStep,
        step,
        previousStep,
        processUpdate
      }}
    >
      {children}
    </AppContext.Provider>
  );
};