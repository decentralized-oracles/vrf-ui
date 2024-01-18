import React from 'react';
import { Box, Grid} from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import ink_svg from "../images/ink.svg"

export function ContentHeader() {

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#202020' : '#fff',
    ...theme.typography.body2,
    textAlign: 'left',
    padding: 20,    
    color: theme.palette.text.secondary,
    fontSize: '1.1em',
    height: '100%'
  }));

  return <>
  <Grid container spacing={4}>
      <Grid item xs={12} >
          <Item>
          <h3>An Oracle to calculate a random number and use it in your Smart Contract</h3>
            <p>In this dApp you can provide a min and a max number and send a transaction to store your query in our Astar Smart Contract.</p>
            <p>you have to connect your wallet to a substrate account with some SBY (Shibuya testnet) to pay the transaction fees. You can find a SBY Faucet on the <a href="https://portal.astar.network/shibuya-testnet/assets">Astar Portal</a> (last button of the "transferable" line of the SBY Asset).</p>
            <p>Behind the scene:
Let you guide through the execution of the overall process which will use a Phat Contract to process the query, calculate a random number, and send back the result to the Astar Smart Contract, thus triggering an event with the result of your query.</p>
          </Item> 
      </Grid>
    </Grid> 
  </>
}

 