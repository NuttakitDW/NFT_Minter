module.exports = function(deployer) {};
const { BigNumber } = require("@ethersproject/bignumber");
const MasterChef = artifacts.require("MasterChef");
const NagaToken = artifacts.require("NagaToken");
const NagaPower = artifacts.require("NagaPower");
const MultiCall = artifacts.require("MultiCall");
const Timelock = artifacts.require("Timelock");

const INITIAL_MINT = '25000';
const BLOCKS_PER_HOUR = (3600 / 3) // 3sec Block Time
const TOKENS_PER_BLOCK = '10';
const BLOCKS_PER_DAY = 24 * BLOCKS_PER_HOUR
const TIMELOCK_DELAY_SECS = (3600 * 24); 
const STARTING_BLOCK = 4853714;
const REWARDS_START = String(STARTING_BLOCK + (BLOCKS_PER_HOUR * 6))
const FARM_FEE_ACCOUNT = '0x7DB8f5d6fD9BAc3DFa680a76dBB78579F555C77c'
const TIMELOCK_ADMIN = '0x7DB8f5d6fD9BAc3DFa680a76dBB78579F555C77c'
 
const logTx = (tx) => {
    console.dir(tx, {depth: 3});
}

// let block = await web3.eth.getBlock("latest")
module.exports = async function(deployer, network, accounts) {
    console.log({network});

    let adminAccount = TIMELOCK_ADMIN;
    let feeAccount = FARM_FEE_ACCOUNT;

    let nagaTokenInstance;
    let nagaPowerInstance;
    let masterChefInstance;

    /**
     * Deploy NagaToken
     */
    deployer.deploy(NagaToken).then((instance) => {
        nagaTokenInstance = instance;
        /**
         * Mint intial tokens for liquidity pool
         */
        return nagaTokenInstance.mint(BigNumber.from(INITIAL_MINT).mul(BigNumber.from(String(10**18))));
    }).then((tx)=> {
        logTx(tx);
        /**
         * Deploy NagaPower
         */
        return deployer.deploy(NagaPower, NagaToken.address)
    }).then((instance)=> {
        nagaPowerInstance = instance;
        /**
         * Deploy MasterChef
         */
        if(network == "matic" || network == "matic-fork") {
            console.log(`Deploying MasterChef with MATIC MAINNET settings.`)
            return deployer.deploy(MasterChef, 
                NagaToken.address,                                         // _naga
                NagaPower.address,                                      // _nagaPower
                feeAccount,                                                   // _devaddr
                BigNumber.from(TOKENS_PER_BLOCK).mul(BigNumber.from(String(10**18))),  // _nagaPerBlock
                REWARDS_START,                                                // _startBlock
            )
        }
        console.log(`Deploying MasterChef with DEV/TEST settings`)
        return deployer.deploy(MasterChef, 
            NagaToken.address, 
            NagaPower.address, 
            feeAccount,
            BigNumber.from(TOKENS_PER_BLOCK).mul(BigNumber.from(String(10**18))), 
            0
        )
        
    }).then((instance)=> {
        masterChefInstance = instance;
        /**
         * TransferOwnership of NAGA to MasterChef
         */
        return nagaTokenInstance.transferOwnership(MasterChef.address);
    }).then((tx)=> {
        logTx(tx);
        /**
         * TransferOwnership of NAGAPOWER to MasterChef
         */
        return nagaPowerInstance.transferOwnership(MasterChef.address);
    }).then((tx)=> {
        /**
         * Deploy MultiCall
         */
        return deployer.deploy(MultiCall);
    }).then(()=> {
        /**
         * Deploy Timelock
         */
        return deployer.deploy(Timelock, adminAccount, TIMELOCK_DELAY_SECS);
    }).then(()=> {
        console.log('Rewards Start at block: ', REWARDS_START)
        console.table({
            MasterChef:MasterChef.address,
            NagaToken:NagaToken.address,
            NagaPower:NagaPower.address,
            MultiCall:MultiCall.address,
            Timelock:Timelock.address
        })
    });
};