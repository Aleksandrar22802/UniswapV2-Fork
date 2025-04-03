import React from "react";
import {
    Container,
    Grid,
    makeStyles,
    Paper,
    Typography,
} from "@material-ui/core";

import SwitchButton from "./SwitchButton";
import LiquidityDeployer from "./LiquidityDeployer";
import LiquidityRemover from "./LiquidityRemove";

const styles = (theme) => ({
    paperContainer: {
        borderRadius: theme.spacing(2),
        padding: theme.spacing(1),
        paddingBottom: theme.spacing(3),
        maxWidth: 700,
        margin: "auto",
    },
    title: {
        textAlign: "center",
        padding: theme.spacing(0.5),
        marginBottom: theme.spacing(1),
    },
    footer: {
        marginTop: "155px",
    },
});

const useStyles = makeStyles(styles);

function Liquidity(props) {
    const classes = useStyles();
    const [deploy, setDeploy] = React.useState(true);
    return (
        <div className="sub-page-liquidity">
            <Container>
                <Paper className={classes.paperContainer}>
                    <Typography variant="h5" className={classes.title}>
                        <SwitchButton setDeploy={setDeploy} />
                    </Typography>
                    {
                        deploy === true ? 
                        <LiquidityDeployer network={props.network} />
                        :
                        <LiquidityRemover network={props.network} />
                    }
                </Paper>
            </Container>
        </div>
    );
}

export default Liquidity;
