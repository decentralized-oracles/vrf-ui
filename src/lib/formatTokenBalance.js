import { formatBalance } from '@polkadot/util';

export const formatTokenBalance = (value,unit,pdec) => {

    formatBalance.setDefaults({unit: unit,decimals: Number(pdec)});
    const formated = formatBalance(
        value,
        { 
            withSiFull: true, 
            withSi: true,
            forceUnit: unit,
            decimals: Number(pdec)
        }
    );
    return formated
}