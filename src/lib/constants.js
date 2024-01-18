export const DAPP_NAME = "Decentralized Oracles";

export const DEFAULT_NETWORKS = {
  astar: "shibuya",
  phala: "poc6",
}

export const SS58_PREFIX = {
  astar:5,
  shiden:5,
  shibuya:5,
  substrate:42,
  rococo:42,
  westend:42,
  polkadot:0,
  kusama:2
};

export const CONTRACT_PALLET_NETWORK = {
  astar: "substrate",
  shiden: "westend",
  shibuya: "rococo"
};

export const NETWORK_TOKENS = {
  astar:"ASTR",
  shiden:"SDN",
  shibuya:"SBY"
};

export const TOKEN_DECIMALS = {
  ASTR: 18,
  SDN: 18,
  SBY: 18
};

export const PROVIDER_ENDPOINTS = {
  astar:"wss://rpc.astar.network",
  shiden:"wss://shiden.api.onfinality.io/ws?apikey=53bc7e7e-1dbf-4272-af42-66c42a474c30",
  shibuya:"wss://shibuya-rpc.dwellir.com",
}

export const ORACLE_CONTRACT_ADDRESS = {
  //shibuya:  "aesULxtrttD4VGe1oDWGnDihbknjQ44GYwN1L8RXMcWZxis",
  shibuya: "ZbPsgJhzaLc9D6kWYdi1hQwaGLkr3hpBgtoPqK8ayXbdDDJ"
};

export const PHALA_PROVIDER_ENDPOINTS = {
  poc6: "wss://poc6.phala.network/ws"
}
export const PHAT_CONTRACT_ID = {
  poc6: "0x593da5483df3e2d82507838a7fd7ac7755c8bd0ff2c8cc49f2ae128d3d8d6c76"
}

import vrf_contract_metadata from "./vrf_contract_metadata.json"
export const ORACLE_CONTRACT_ABI_METADATA = {
  shibuya:  vrf_contract_metadata,
};
