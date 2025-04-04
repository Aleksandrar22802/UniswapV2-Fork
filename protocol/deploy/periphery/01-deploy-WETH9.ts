import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { blockConfirmation, developmentChains } from "../../helper-hardhat-config";
import { verify } from "../../scripts/utils/verify";

const deployWETH9: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log } = deployments;
    const { deployer, deployer_1, deployer_2 } = await getNamedAccounts();

    log("----------------------------------------------------");
    log("Deploying WETH9 and waiting for confirmations...");

    /*
    const weth9 = await deploy("WETH9", {
        from: deployer,
        args: [],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: blockConfirmation[network.name] || 1,
    });
    */
    const weth9 = await deploy("WETH9", {
        from: deployer_1,
        args: [],
        log: true,
        // no need to wait block because of testnet
        // // we need to wait if on a live network so we can verify properly
        // waitConfirmations: blockConfirmation[network.name] || 1,
    });

    log("weth9.address = " + weth9.address);

    // verify if not on a local chain
    // if (!developmentChains.includes(network.name)) {
    if (developmentChains.includes(network.name)) {
        console.log("Wait before verifying");
        await verify(weth9.address, []);
    }
};

export default deployWETH9;
deployWETH9.tags = ["all", "periphery", "WETH9"];