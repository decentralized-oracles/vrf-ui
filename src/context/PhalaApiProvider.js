import { ApiPromise, WsProvider } from "@polkadot/api";
import { typeDefinitions } from '@polkadot/types'
import { types} from "@phala/sdk";
import React, { useState, useEffect } from "react";

export const PhalaApiContext = React.createContext();

const WS_PROVIDER = "wss://poc6.phala.network/ws";

export const PhalaApiProvider = ({ children }) => {
  
  const [api, setapi] = useState();
  const [provider, setLocalProvider] = useState(new WsProvider(WS_PROVIDER));

  useEffect(() => {
    connectApi();
  }, []);

  const setProvider = (p) => {
    setLocalProvider(new WsProvider(p))
  }

  const connectApi = async () => {
    try { 
      //const provider = ;
      const api = await ApiPromise.create({ 
        provider,
        types: { ...types, ...typeDefinitions }
      });
      setapi(api);
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PhalaApiContext.Provider
      value={{
        api,
        provider,
        setProvider,
        connectApi
      }}
    >
      {children}
    </PhalaApiContext.Provider>
  );
};