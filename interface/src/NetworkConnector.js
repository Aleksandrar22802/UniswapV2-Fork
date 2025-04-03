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
    network.coins = [];

    const backgroundListener = useRef(null);

    async function setupConnection() {
        try {
            console.log('-------------- setupConnection --------------');

            console.log("getProvider...");
            if (network.provider == null || network.provider.current === undefined || network.provider.current == null) {
                network.provider = new ethers.providers.Web3Provider(window.ethereum);
                if (network.provider === undefined || network.provider == null) {
                    return;
                }
            }

            console.log("getSigner...");
            if (network.signer == null || network.signer.current === undefined || network.signer.current == null) {
                network.signer = await network.provider.getSigner();
                if (network.signer === undefined || network.signer == null) {
                    return;
                }
            }

            console.log("getAccount...");
            if (network.account == null || network.account.current === undefined || network.account.current === null) {
                network.account = await getAccount();
                if (network.account === undefined || network.account == null) {
                    return;
                }
            }

            console.log("getNetwork...");
            await getNetwork(network.provider).then(async (chainId) => {
                console.log("chainId = " + chainId);
                // Set chainID
                network.chainID = chainId;
                if (chains.chainIdList.includes(chainId)) {
                    // Get the router using the chainID
                    network.router = await getRouter(
                        chains.routerContractAddressMap.get(chainId),
                        network.signer
                    );
                    // Get default coins for network
                    network.coins = COINS.get(chainId);
                    // Get Weth address from router
                    await network.router.WETH().then((wethAddress) => {
                        // for WETH Debug
                        console.log("wethAddress........................");
                        console.log(wethAddress);

                        network.weth = getWeth(wethAddress, network.signer);
                        // Set the value of the weth address in the default coins array
                        network.coins[0].address = wethAddress;
                    });
                    // Get the factory address from the router
                    await network.router.factory().then((factory_address) => {
                        network.factory = getFactory(
                            factory_address,
                            network.signer
                        );
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
                // console.log("running createListener 1...");
                let account = await getAccount();
                if (account != network.account) 
                {
                    // console.log("running createListener 2...");
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
        if (backgroundListener.current != null) {
            clearInterval(backgroundListener.current);
        }

        backgroundListener.current = createListener();
        clearInterval(backgroundListener.current);
    }

    useEffect(() => {
        initConnection();
    }, []);

    return (
        <>
            {
                isConnected == true ? 
                <div> 
                    {props.render(network)}
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
