import { ApiPromise, WsProvider } from "@polkadot/api";
import React, { useState, useEffect } from "react";
import { options } from "@astar-network/astar-api";
import { PROVIDER_ENDPOINTS, DEFAULT_NETWORKS } from "../lib/constants";

export const AstarApiContext = React.createContext();

export const AstarApiProvider = ({ children }) => {
  const [api, setapi] = useState();
  const [network, setNetwork] = useState(DEFAULT_NETWORKS["astar"]); // ici default network est le type de network, pas la chain
  const [provider, setProvider] = useState()

  useEffect(() => {
    console.log("CONNECTAPI NETWORK",network)
    if (network) connectApi();
  }, [network]);

  const connectApi = async () => {
    try { 
      const provider = new WsProvider(PROVIDER_ENDPOINTS[network]);
      setProvider(provider);
      const apiPromise = new ApiPromise(options({ provider }));
      await apiPromise.isReady;
      setapi(apiPromise);
      console.log("connected to "+network+" API: "+PROVIDER_ENDPOINTS[network])
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AstarApiContext.Provider
      value={{
        api,
        provider,
        network,
        setNetwork
      }}
    >
      {children}
    </AstarApiContext.Provider>
  );
};