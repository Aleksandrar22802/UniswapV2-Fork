import { useEffect, useState, useRef } from "react";
// import { createTheme, ThemeProvider } from "@material-ui/core";
// import { Contract, ethers } from "ethers";
import { ethers } from "ethers";
// import { SnackbarProvider } from "notistack";

// import { useAccount, useConnect } from 'wagmi'

import {
    getAccount,
    getFactory,
    getRouter,
    getNetwork,
    getWeth,
} from "./EthereumFunctions";

import ConnectWalletPage from "./Components/ConnectWalletPage";


import COINS from "./constants/coins";
import * as chains from "./constants/chains";

// const theme = createTheme({
//     palette: {
//         primary: {
//             main: "#ff0000",
//             contrastText: "#ffffff",
//         },
//         secondary: {
//             main: "#9e9e9e",
//             contrastText: "#ffffff",
//         },
//     },
// });

// const autoReconnectDelay = 5000;

const NetworkConnector = (props) => {

    const [isConnected, setIsConnected] = useState(false);

    let network = Object.create({})
    network.provider = useRef(null);
    network.signer = useRef(null);
    network.account = useRef(null);
    network.chainID = useRef(null);
    network.router = useRef(null);
    network.factory = useRef(null);
    network.weth = useRef(null);
    network.coins = useRef(null);

    const bgListener = useRef(null);

    async function setupConnection() {
        try {
            console.log('-------------- setupConnection --------------');

            console.log("getProvider...");
            if (network.provider.current === undefined || network.provider.current == null) {
                network.provider.current = new ethers.providers.Web3Provider(window.ethereum);
                if (network.provider.current === undefined || network.provider.current == null) {
                    return;
                }
            }

            console.log("network.provider...");
            console.log(network.provider.current);

            console.log("getSigner...");
            if (network.signer.current === undefined || network.signer.current == null) {
                network.signer.current = await network.provider.current.getSigner();
                if (network.signer.current === undefined || network.signer.current == null) {
                    return;
                }
            }

            console.log("network.signer...");
            console.log(network.signer.current);

            console.log("getAccount...");
            if (network.account.current === undefined || network.account.current === null) {
                network.account.current = await getAccount();
                if (network.account.current === undefined || network.account.current === null) {
                    return;
                }
            }

            console.log("network.account...");
            console.log(network.account.current);

            console.log("getNetwork...");
            await getNetwork(network.provider.current).then(async (chainId) => {
                console.log("chainId = " + chainId);
                // Set chainID
                network.chainID.current = chainId;

                console.log("network.chainID...");
                console.log(network.chainID.current);
    
                if (chains.chainIdList.includes(chainId)) {
                    // Get the router using the chainID
                    network.router.current = await getRouter(
                        chains.routerContractAddressMap.get(chainId),
                        network.signer.current
                    );

                    console.log("network.router...");
                    console.log(network.router.current);
    
                    // Get default coins for network
                    network.coins.current = COINS.get(chainId);

                    console.log("network.coins...");
                    console.log(network.coins.current);

                    // Get Weth address from router
                    await network.router.current.WETH().then((wethAddress) => {
                        // for WETH Debug
                        // console.log("wethAddress........................");
                        // console.log(wethAddress);
                        network.weth.current = getWeth(wethAddress, network.signer.current);

                        console.log("network.weth...");
                        console.log(network.weth.current);

                        // Set the value of the weth address in the default coins array
                        network.coins.current[0].address = wethAddress;
                    });
                    // Get the factory address from the router
                    await network.router.current.factory().then((factoryAddress) => {
                        network.factory.current = getFactory(
                            factoryAddress,
                            network.signer.current
                        );

                        console.log("network.factory...");
                        console.log(network.factory.current);
                    });

                    setIsConnected(true);

                    // console.log("network is ... ");
                    // console.log(network);
                } 
                else 
                {
                    setIsConnected(false);
                }
            });

        } catch (err) {
            setIsConnected(false);
            console.log('setupConnection error...');
            console.log(err);
        }
    }

    const createListener = async () => {
        return setInterval(async () => {
            try {
                console.log("running createListener 1...");
                let account = await getAccount();
                if (account != network.account.current) 
                {
                    console.log("running createListener 2...");
                    await setupConnection();
                }
            } catch (err) {
                setIsConnected(false);
                console.log('getAccount error...');
                console.log(err);
            }
        }, 1000);
    }

    const initConnection = async () => {
        // Initial setup
        console.log("initConnection...");

        await setupConnection();

        // Start background listener
        if (bgListener.current != null) {
            clearInterval(bgListener.current);
        }

        bgListener.current = createListener();
        clearInterval(bgListener.current);
    }

    useEffect(() => {
        initConnection();
    }, []);

    let newParam = null;
    if (isConnected === true)
    {
        newParam = {
            provider: network.provider.current,
            signer: network.signer.current,
            account: network.account.current,
            chainID: network.chainID.current,
            router: network.router.current,
            factory: network.factory.current,
            weth: network.weth.current,
            coins: network.coins.current,
        };
    }

    return (
        <>
            {
                newParam != null ? 
                <div> 
                    {props.render(newParam)}
                </div>
                :
                <div>
                    <ConnectWalletPage />
                </div>
            }
        </>
    );
};

export default NetworkConnector;
