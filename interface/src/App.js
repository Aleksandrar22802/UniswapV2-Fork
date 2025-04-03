import React from "react";
import { Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { createTheme, ThemeProvider } from "@material-ui/core";

import NarBar from "./NavBar/NavBar";

import NetworkConnector from "./NetworkConnector";
import CoinSwapper from "./CoinSwapper/CoinSwapper";
import Liquidity from "./Liquidity/Liquidity";

import "./App.css";

const theme = createTheme({
    palette: {
        primary: {
            main: "#ff0000",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#9e9e9e",
            contrastText: "#ffffff",
        },
    },
});

const App = () => {
    return (
        <div className="App">
            <SnackbarProvider maxSnack={3}>
                <ThemeProvider theme={theme}>
                    <NetworkConnector
                        render={(network) => (
                            <div>
                                <NarBar />
                                <Route exact path="/">
                                    <Liquidity network={network} />
                                </Route>
                                <Route exact path="/swap">
                                    <CoinSwapper network={network} />
                                </Route>
                            </div>
                        )}
                    ></NetworkConnector>
                </ThemeProvider>
            </SnackbarProvider>
        </div>
    );
};

export default App;
