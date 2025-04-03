import React from "react";
import {
    Container,
    // Grid,
    makeStyles,
    Paper,
    Typography,
} from "@material-ui/core";
// import { red } from "@material-ui/core/colors";

const styles = (theme) => ({
    paperContainer: {
        borderRadius: theme.spacing(2),
        padding: theme.spacing(1),
        paddingBottom: theme.spacing(3),
        maxWidth: 700,
        margin: "auto",
        marginTop: "200px",
    },
    fullWidth: {
        width: "100%",
    },
    title: {
        textAlign: "center",
        padding: theme.spacing(0.5),
        marginBottom: theme.spacing(1),
        color: "rgb(255, 0, 0)",
    },
    hr: {
        width: "100%",
    },
    balance: {
        padding: theme.spacing(1),
        overflow: "wrap",
        textAlign: "center",
    },
    buttonIcon: {
        marginRight: theme.spacing(1),
        padding: theme.spacing(0.4),
    },
    footer: {
        marginTop: "155px",
    },
});

const useStyles = makeStyles(styles);

function ConnectWalletPage() {
    const classes = useStyles();
    return (
        <div>
            <div className="nav-bar-title">
                <h1 className="navbar-logo">
                    My UniswapV2
                </h1>
            </div>

            <Container>
                <Paper className={classes.paperContainer}>
                    <Typography
                        variant="h3"
                        className={classes.title}
                        color="common.white"
                    >
                        Welcome!, Please connect Metamask wallet.
                    </Typography>
                </Paper>
            </Container>
        </div>
    );
}

export default ConnectWalletPage;
