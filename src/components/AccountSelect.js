import { Button } from "@mui/material";
import { Box } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../context/ContextProvider";
import { WalletSelect } from '@talismn/connect-components';
import { DAPP_NAME } from "../lib/constants.js";

export function AccountSelect() {

  const { account, setAccount } = useContext(AppContext);
  const defaultAccount = {name:"Connect",wallet:{logo:{src:"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJsb2dpbl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjAiIHk9IjAiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBpZD0iWE1MSURfMjFfIiBkPSJNMzAuOSA4MC4yYzAgMS4zIDEuNSAxLjkgMi41IDEuMWwzMi45LTMwLjJjLjMtLjMuNS0uNy41LTEuMSAwLS40LS4yLS44LS41LTEuMWwtMzMtMzAuMmMtLjktLjktMi41LS4yLTIuNSAxLjF2MTguMUgxMi4xYy0xLjEgMC0yLjEuOS0yLjEgMi4xdjIwLjFjMCAxLjEuOSAyLjEgMi4xIDIuMWgxOC44djE4eiIgZmlsbD0iI0VFRUVFRSIvPjxnPjxwYXRoIGQ9Ik03NiA4Mi4zSDU3LjFjLTIuNyAwLTQuOS0yLjItNC45LTQuOXMyLjItNC45IDQuOS00LjlINzZjMi4zIDAgNC4zLTEuOSA0LjMtNC4zVjMxLjZjMC0yLjMtMS45LTQuMy00LjMtNC4zSDU3LjFjLTIuNyAwLTQuOS0yLjItNC45LTQuOXMyLjItNC45IDQuOS00LjlINzZjNy43IDAgMTQgNi4zIDE0IDE0djM2LjdjMCA3LjktNi4zIDE0LjEtMTQgMTQuMXoiIGZpbGw9IiNFRUVFRUUiLz48L2c+PC9zdmc+Cg=="}}}
  const activeAccount = (account !== undefined && account !== null) ? account : defaultAccount;
  //console.log("ActiveAccount",activeAccount)
  return <WalletSelect
        onlyShowInstalled
        dappName={DAPP_NAME}
        showAccountsList={true}
        triggerComponent={
          <Box sx={{float:'right'}}>
            <Button 
              variant="outlined" 
              startIcon={
                <img
                  src={activeAccount?.wallet?.logo?.src}
                  alt="Connect"
                  loading="lazy"
                  width={20}
                  height={20}
                />
              }
            >
              {activeAccount?.name}
            </Button>
          </Box>
        } 
        onAccountSelected={(account) => { setAccount(account)}}
      />
}
