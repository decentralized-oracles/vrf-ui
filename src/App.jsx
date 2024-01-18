import * as React from "react";
import Container from "@mui/material/Container";
import { AppMenu } from "./components/AppMenu";
import { Box } from "@mui/material";
import { Content } from "./components/Content";
import { ContentHeader } from "./components/ContentHeader";
import { AppHeader } from "./components/AppHeader";
import { AccountSelect } from "./components/AccountSelect";
import { ContextProvider } from "./context/ContextProvider";
import { AstarApiProvider } from "./context/AstarApiProvider";
import { PhalaApiProvider } from "./context/PhalaApiProvider";
import { PhatContractProvider } from "./context/PhatContractProvider";
import { AstarContractProvider } from "./context/AstarContractProvider";
import { Toaster } from 'react-hot-toast';

import { Grid } from "@mui/material";
import './assets/style.css';
import { Margin } from "@mui/icons-material";

export default function App() {
  return (
      
        <AstarApiProvider>
          <PhalaApiProvider>
            <PhatContractProvider>
              <ContextProvider>
                <AstarContractProvider>
                  <Toaster />
                  <Container sx={{pt:2}} maxWidth="lg">
                    <Grid container spacing={2}>
                      <Grid item xs={9}>
                        <AppHeader /> 
                      </Grid>
                      <Grid item xs={3} sx={{margin:'auto'}}>
                        <Box> <AppMenu /></Box>
                        <AccountSelect />
                      </Grid>
                      <Grid item xs={12}>
                        <ContentHeader />
                        <Content />
                      </Grid>
                    </Grid>
                  </Container>
                </AstarContractProvider>
              </ContextProvider>
            </PhatContractProvider>
          </PhalaApiProvider>
        </AstarApiProvider>
      
  );
}
