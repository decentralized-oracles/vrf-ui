import React from 'react';
import { Typography } from '@mui/material';
import { useContext } from "react";
import { AppContext } from "../context/ContextProvider";

export function AppHeader() {
  const { dappName } = useContext(AppContext);

  return (<>
    <Typography width={"100%"} fontFamily={"unbounded"} variant="h3" gutterBottom>
        
        <span style={{color:"#CC0060"}}>Dec</span>entralized <span style={{color:"#CC0060"}}>Or</span>acle
    </Typography>
  </>);
}