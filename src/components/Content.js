import React, { useContext, useState, useEffect, useRef } from 'react';
import { Box, Button, Grid, TextField, LinearProgress, CircularProgress} from '@mui/material';
import { AppContext } from '../context/ContextProvider';
import { ApiStatus } from './ApiStatus';
import Lottie from "react-lottie";

import { ContractContext } from '../context/AstarContractProvider';
import { PhatContractContext } from '../context/PhatContractProvider';

import dapp_img from "../images/dapp.svg"
import astar_logo from "../images/astar_logo.svg"
import astar_logo_png from "../images/astar.png"
import phala_logo from "../images/phala_logo.svg"

import initPng from '../images/init.png'
import toast from 'react-hot-toast';
//Object.values(coins).forEach((ele)=>{console.log(ele)})

export function Content() {

  const {account, refConnectButton, lastUpdate, stepDef, step, previousStep, processUpdate} = useContext(AppContext);
  const {contract, doTx, doDryRun, dryRun, randomNumber} = useContext(ContractContext)
  const {vrf_query_answerRequest} = useContext(PhatContractContext)

  //const step=4
  
  const [localRandom,setLocalRandom] = useState()
  const [consoleStepDef,setConsoleStepDef] = useState("Idle")

  const barEmpty = {bar:'determinate',barpc:0}
  const barLoading = {bar:'indeterminate',barpc:0}
  const barFull = {bar:'determinate',barpc:100}

  const [bar1,setBar1] = useState({bar:'determinate',barpc:0})
  const [bar2,setBar2] = useState({bar:'determinate',barpc:0})
  const [bar3,setBar3] = useState({bar:'determinate',barpc:0})
  const [circle1,setCircle1] = useState("")
  const [circle2,setCircle2] = useState("")
  const [circle3,setCircle3] = useState("")
  const [circle4,setCircle4] = useState("")

  useEffect(()=>{
    setBar1(step == 2 ? barLoading : step <= 1 ? barEmpty : barFull)
    setBar2(step == 3 ? barLoading : step <= 2 ? barEmpty : barFull)
    setBar3(step == 4 ? barLoading : step <= 3 ? barEmpty : barFull)
    setCircle1(step == 1 ? " animate" : step <= 0 ? "" : " ok")
    setCircle2(step == 2 ? " animate" : step <= 1 ? "" : " ok")
    setCircle3(step == 3 ? " animate" : step <= 2 ? "" : " ok")
    setCircle4(step == 4 ? " animate" : step <= 3 ? "" : " ok")
  },[processUpdate])

  useEffect(()=> {
    let tmp = step==1 ? <></> : <>{consoleStepDef}<br/></>

    if (step==1) {setConsoleStepDef(<>{tmp}{stepDef}</>)}
    if (step==2) {setConsoleStepDef(<>{tmp}{stepDef}</>)}
    if (step==3) {setConsoleStepDef(<>{tmp}{stepDef}</>)}
    if (step==4) {setConsoleStepDef(<>{tmp}{stepDef}</>)}
    if (step==5) {setConsoleStepDef(<>{tmp}{stepDef}</>)}

  },[stepDef])

/*
Initiating process: sending a request to wallet, waiting for approval
Astar Tx `requestRandomValue`: sending a VRF request to the Astar smart contract
Phat Contract query: Process the VRF request by a Phat Contract rollup transaction
Astar Event: waiting for the result to be stored in the Astar Smart Contract event `RandomValueReceived`
Random number has successfuly been processed and has been stored into the Astar smart contract.
*/

  const refMin = useRef()
  const refMax = useRef()

  useEffect(()=>{
    setLocalRandom(randomNumber)
  },[randomNumber])

  const toastOptions = {
    duration: 10000,
    position: 'bottom-right',
    style: {maxWidth:600},
  }
  const toastWithDismiss = (message) => {
    const toastValue = (t) => (
      <span className="text-right">
        <span>{message}</span>
        <Button sx={{margin:'0 3px', textTransform:'none'}} onClick={() => toast.dismiss(t.id)}>X</Button>
      </span>
    )
    toast(toastValue,toastOptions);
  }
  const sendRequest = () => {
    if (!account) {refConnectButton.current.click()}
    if (refMin.current?.value && refMax.current?.value) {
      if (refMin.current?.value < refMax.current?.value) {
        console.log("sending tx with min="+refMin.current.value+" and max="+refMax.current.value)
        doTx("requestRandomValue",refMin.current.value,refMax.current.value)
      }
      else {
        toastWithDismiss("Min must be lower than Max")
      }
    }
    else {
      toastWithDismiss("Please enter a Min and Max value");
    }
  }

  const boxopts = {
    display: 'flex', justifyContent:'center',
    border:"1px rgba(255, 255, 255, 0.23) solid", 
    margin:{xs:"10px 20px",sm: '20px 40px'}, 
    padding:2, 
    backgroundColor:"#0b0a0a", 
    borderRadius:3,
    fontSize: '0.9rem'
  }
  const resopts={
    display: 'inline-block',
    border: '1px rgba(255, 255, 255, 0.23) solid',
    padding: '0 5px',
    backgroundColor: '#202020',
    color: '#00FF00',
    borderRadius: '10px',
    minWidth: '45px',
    height: '1.5em',
    verticalAlign: 'bottom',
    textAlign: 'center'
  }
  const lineopts = {
    backgroundColor:'#235500', 
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#00EE00'
    },
    margin:'7.7% 0 0 22%', 
    width:'20%', 
    height:'5%', 
    position:'absolute', 
    zIndex:3 
  }


  return <>
  
    <Box sx={{margin:"0 40px 0px 0", flexDirection: 'row-reverse' }} display={'flex'} >
      <ApiStatus context="phala" /><ApiStatus context="astar" />
    </Box>
   

    <Box sx={{padding:"50px 40px 0 40px"}} display={'flex'} justifyContent={'center'}>
      <TextField inputRef={refMin} sx={{margin:'0 20px 0 0'}} id="min-value" label="Min" variant="outlined" />
      <TextField inputRef={refMax} sx={{margin:'0 20px 0 0'}} id="max-value" label="Max" variant="outlined" />
      <Button sx={{lineHeight:1.4, fontSize:'0.8rem'}} onClick={sendRequest} variant="contained">Send Request</Button>
    </Box>

    <Box className='reset-line-height' sx={{...boxopts, border:"1px green solid", backgroundColor:"#202020"}}>
      <Box sx={{paddingY:'5%', position:'relative', width:'100%'}}>
        <LinearProgress variant={bar1.bar} value={bar1.barpc} sx={{...lineopts,margin:'7.7% 0 0 22%'}} />
        <LinearProgress variant={bar2.bar} value={bar2.barpc} sx={{...lineopts,margin:'7.7% 0 0 44%'}} />
        <LinearProgress variant={bar3.bar} value={bar3.barpc} sx={{...lineopts,margin:'7.7% 0 0 66%'}} />
        <Box sx={{width:'17%', marginLeft:'9%'}} className={'logo-wrapper'+circle1}>
          <Box className='logo-img' component="img" src={dapp_img} alt='Logo Astar' />
        </Box>
        <Box className={'logo-wrapper'+circle2}>
          <Box className='logo-img' component="img" src={astar_logo_png} alt='Logo Astar' />
        </Box>
        <Box className={'logo-wrapper'+circle3}>
          <Box className='logo-img' component="img" src={phala_logo} alt='Logo Astar' />
        </Box>
        <Box className={'logo-wrapper'+circle4}>
          <Box className='logo-img' component="img" src={astar_logo_png} alt='Logo Astar' />
        </Box>
      </Box>
    </Box>
    <Box sx={{...boxopts,display: 'flex', justifyContent:'space-around', fontSize:'1.2em'}}>
      <Box>Request: 
        <Box sx={{display:'inline-flex', overflow:'hidden', marginLeft:'5px'}}>
          Min=<Box sx={resopts}>{localRandom?.requestMin}</Box>
        </Box> 
        <Box sx={{display:'inline-flex', overflow:'hidden', marginLeft:'5px'}}>
          Max=<Box sx={resopts}>{localRandom?.requestMax}</Box>
        </Box>
      </Box>
      &nbsp;
      <Box>Result: 
        <Box sx={{display:'inline-flex', overflow:'hidden', marginLeft:'5px'}}>
          VRF=<Box sx={resopts}>{localRandom?.randomNumber}</Box>
        </Box>
      </Box>
    </Box>

    <Box sx={{...boxopts, justifyContent:'left'}}>
      {consoleStepDef}
    </Box>
        


  </>
}

  /*
    <button onClick={()=>doDryRun()}>doDryRun</button>
    <button onClick={()=>doTx("requestRandomValue",10,100)}>doTx requestRandomValue 10 100</button>
    <br/>
    <button onClick={()=>vrf_query_answerRequest()}>vrf_query_answerRequest</button>
    

    <Box>{localRandom?.requestAddress}</Box>
    <Box>{localRandom?.requestNonce}</Box>
    <Box> {localRandom?.requestMin}</Box>
    <Box> {localRandom?.requestMax}</Box>
    <Box> {localRandom?.requestTime}</Box>
    <Box> {localRandom?.randomNumber}</Box>
    <Box> {localRandom?.responseTime}</Box>

  <Box sx={{ border:"1px green solid", margin:"0 40px", padding:"50px", backgroundColor:"#202020", borderRadius:3}}>
      <Box sx={{ position:"relative", margin:"0"}}>
        <Box sx={{ position:"absolute", width:"15.4%", left:"14.9%", top: "24%" }} >
          <Lottie options={greenBar} isStopped={stopped1} isClickToPauseDisabled={true}/>
        </Box>
        <Box sx={{ position:"absolute", width:"15.4%", left:"42.5%", top: "24%" }} >
          <Lottie options={greenBar} isStopped={stopped1} isClickToPauseDisabled={true}/>
        </Box>
        <Box sx={{ position:"absolute", width:"15.4%", left:"70.5%", top: "24%" }} >
          <Lottie options={greenBar} isStopped={stopped1} isClickToPauseDisabled={true}/>
        </Box>
        <Box component="img" sx={{maxWidth:"100%"}} src={initPng} />
      </Box>
    </Box>
  */