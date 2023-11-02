import { PhalaApiContext } from '../context/PhalaApiProvider';
import { AstarApiContext } from '../context/AstarApiProvider';
import { useContext } from 'react';
import { Box, Chip, Tooltip } from '@mui/material';
import { DEFAULT_NETWORKS, ORACLE_CONTRACT_ADDRESS, PHAT_CONTRACT_ID } from '../lib/constants';
import {Typography} from '@mui/material';

export function ApiStatus(props) {

    const GreenDot = ()=>{
        return <>
            <svg fill="#00b100" width="30px" height="30px" viewBox="0 0 20.00 20.00" xmlns="http://www.w3.org/2000/svg" stroke="#00b100" strokeWidth="2">
                <g id="SVGRepo_iconCarrier"><path d="M7.8 10a2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0-4.4 0z"></path></g>
            </svg>
        </>
    }
    const RedDot = ()=>{
        return <>
            <svg fill="#b10000" width="30px" height="30px" viewBox="0 0 20.00 20.00" xmlns="http://www.w3.org/2000/svg" stroke="#b10000" strokeWidth="2">
                <g id="SVGRepo_iconCarrier"><path d="M7.8 10a2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0-4.4 0z"></path></g>
            </svg>
        </>
    }
    const StatusDot = (props)=> {
        if(props.api?._isReady) {
            return <GreenDot/>
        }
        else {
            return <RedDot/>
        }
    }

    const phalaContext = useContext(PhalaApiContext)
    const astarContext = useContext(AstarApiContext)

    const apis={phala:phalaContext, astar:astarContext}
    const api = apis[props.context].api
    const provider = apis[props.context].provider

    const context = props.context.charAt(0).toUpperCase() + props.context.slice(1);

    const address = props.context === "astar" ? ORACLE_CONTRACT_ADDRESS[DEFAULT_NETWORKS[props.context]] : PHAT_CONTRACT_ID[DEFAULT_NETWORKS[props.context]]
    //console.log("Api.provider",provider?.endpoint)
    return (<>
        <Tooltip placement="top" title={<><Typography m={"5px 0"} p={0}>{provider?.endpoint}</Typography>{address}</>}>
            <Chip sx={{ marginLeft: '10px' }} icon={<StatusDot api={api} />} label={context+" testnet"} />
        </Tooltip>
    </>);

}