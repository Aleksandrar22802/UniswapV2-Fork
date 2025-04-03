import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";

import { blockConfirmation, developmentChains } from "../../helper-hardhat-config";
import { verify } from "../../scripts/utils/verify";
import { UniswapV2Factory } from "../../typechain-types";

const deployUniswapV2Factory: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log } = deployments;
    const { deployer, deployer_1, deployer_2 } = await getNamedAccounts();

    log("----------------------------------------------------");
    log("Deploying UniswapV2Factory and waiting for confirmations...");

    // log("network.name = " + network.name);
    // log("deployer_1 = " + deployer_1);
    // log("deployer_2 = " + deployer_2);

    // Warning : Here 'args' is caller of setFeeTo, setFeeToSetter functions in UniswapV2Library.sol
    /*
    const uniswapV2Factory = await deploy("UniswapV2Factory", {
        from: deployer,
        args: [deployer],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: blockConfirmation[network.name] || 1,
    });
    */
    const uniswapV2Factory = await deploy("UniswapV2Factory", {
        from: deployer_1,
        args: [deployer_1],
        log: true,
        // no need to wait block because of testnet
        // // we need to wait if on a live network so we can verify properly
        // waitConfirmations: blockConfirmation[network.name] || 1,
    });

    log("uniswapV2Factory.address = " + uniswapV2Factory.address);

    // const uniswapV2FactoryContract = await ethers.getContract('UniswapV2Factory', deployer) as UniswapV2Factory;
    const uniswapV2FactoryContract = await ethers.getContract('UniswapV2Factory', deployer_1) as UniswapV2Factory;
    log(`\nCODE HASH = ${await uniswapV2FactoryContract.INIT_CODE_PAIR_HASH()}\n`);

    log("uniswapV2FactoryContract.getAddress() = ");
    log(uniswapV2FactoryContract.getAddress());

    // verify if not on a local chain
    // if (!developmentChains.includes(network.name)) {
    if (developmentChains.includes(network.name)) {
        console.log("Wait before verifying");
        // await verify(uniswapV2Factory.address, [deployer]);
        await verify(uniswapV2Factory.address, [deployer_1]);
    }
};

export default deployUniswapV2Factory;
deployUniswapV2Factory.tags = ["all", "core", "Factory", "UniswapV2Factory"];