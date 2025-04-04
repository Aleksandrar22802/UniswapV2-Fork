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

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [account, setAccount] = useState(null);
    const [chainID, setChainID] = useState(null);
    const [router, setRouter] = useState(null);
    const [factory, setFactory] = useState(null);
    const [weth, setWeth] = useState(null);
    const [coins, setCoins] = useState([]);

    const [bgListener, setBgListener] = useState(null);

    async function setupConnection() {
        try {
            console.log('-------------- setupConnection --------------');

            let localProvider = null;
            let localSigner = null;
            let localAccount = null;

            console.log("getProvider...");
            if (provider == null) {
                localProvider = new ethers.providers.Web3Provider(window.ethereum);
                if (localProvider === undefined || localProvider == null) {
                    return;
                }
                await setProvider(localProvider);
            } else {
                localProvider = provider;
            }

            console.log("getSigner...");
            if (signer == null) {
                localSigner = await localProvider.getSigner();
                if (localSigner === undefined || localSigner == null) {
                    return;
                }
                await setSigner(localSigner);
            } else {
                localSigner = signer;
            }

            console.log("getAccount...");
            if (account == null) {
                localAccount = await getAccount();
                if (localAccount === undefined || localAccount == null) {
                    return;
                }
                await setAccount(localAccount);
            } else {
                localAccount = account;
            }

            console.log("getNetwork...");
            await getNetwork(localProvider).then(async (chainId) => {
                console.log("chainId = " + chainId);
                // Set chainID
                await setChainID(chainId);
                if (chains.chainIdList.includes(chainId)) {
                    // Get the router using the chainID
                    let localRouter = await getRouter(
                        chains.routerContractAddressMap.get(chainId),
                        localSigner
                    );
                    await setRouter(localRouter);

                    // Get default coins for network
                    let localCoins = COINS.get(chainId);
                    await setCoins(localCoins);

                    // Get Weth address from router
                    await localRouter.WETH().then(async (wethAddress) => {
                        // for WETH Debug
                        // console.log("wethAddress........................");
                        // console.log(wethAddress);

                        let localWeth = getWeth(wethAddress, localSigner);
                        await setWeth(localWeth);

                        // // Set the value of the weth address in the default coins array
                        // network.coins[0].address = wethAddress;
                    });

                    // Get the factory address from the router
                    await localRouter.factory().then(async (factoryAddress) => {
                        let localFactory = getFactory(
                            factoryAddress,
                            localSigner
                        );
                        await setFactory(localFactory);
                    });

                    setIsConnected(true);
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
                let localAccount = await getAccount();
                if (localAccount != account)
                {
                    // console.log("----------------------------------");
                    // console.log("account = " + account);
                    // console.log("localAccount = " + localAccount);
        
                    // console.log("running createListener 2...");
                    await setupConnection();
                } else {
                    // await setIsConnected(true);
                }
            } catch (err) {
                await setIsConnected(false);
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
        if (bgListener != null) {
            clearInterval(bgListener);
        }

        let localBgListener = await createListener();
        await setBgListener(localBgListener);
        // clearInterval(localBgListener);
    }

    useEffect(() => {
        console.log("####################################");
        initConnection();
    }, []);

    let network = null;
    if (isConnected === true)
    {
        network = {
            provider,
            signer,
            account,
            chainID,
            router,
            factory,
            weth,
            coins,
        };
    }

    return (
        <>
            {
                network != null ? 
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
