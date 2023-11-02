import { encodeAddress } from "@polkadot/util-crypto";

//const network = "shibuya"

export const formatAddressShort = (
  address,
  prefix,
  keep = 4
) => {
    if(typeof prefix === "undefined") prefix = 42
    const formatted = encodeAddress(address, prefix);
    return `${formatted.substring(0, keep)}…${formatted.substring(
        address.length - keep
    )}`;
};