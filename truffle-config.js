const HDWalletProvider = require("@truffle/hdwallet-provider");

require('dotenv').config();  // Store environment-specific variable from '.env' to process.env

module.exports = {
  contracts_build_directory: "./build",
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    },
    mumbai: {
      provider: () => new HDWalletProvider(process.env.PK, `https://rpc-mumbai.matic.today`),
      network_id: 80001,
      gasPrice: 10000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    matic: {
      provider: () => new HDWalletProvider(process.env.PK, `https://rpc-mainnet.matic.network`),
      network_id: 137,
      gasPrice: 1000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    mainnet: {
      provider: () => new HDWalletProvider(process.env.PK, "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY),
      port: 8545,
      network_id: "1",
      gas: 6000000,
      gasPrice: 4000000000
    },
    rinkeby: {
      provider: () => new HDWalletProvider(process.env.PK, "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY),
      port: 8545,
      network_id: "4",
      gas: 6000000,
      gasPrice: 40000000000
    },
    avax: {
      provider: () => new HDWalletProvider(process.env.PK, "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY),
      port: 8545,
      network_id: "3",
      gas: 6000000,
      gasPrice: 40000000000
    },
    rinkebyLocal: {
      host: "localhost",
      port: 8545,
      network_id: "4", // Rinkeby network id
      from:"0x1e09a22f24d8fd302b2028a688658e9b29551969"
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8545,         // <-- If you change this, also set the port option in .solcover.js.
      gas: 0xfffffffffff, // <-- Use this high gas value
      gasPrice: 0x01      // <-- Use this low gas price
    },
    goerli: {
      provider: () => new HDWalletProvider(privateKey, `https://goerli.infura.io/v3/dd2249cc150347d19ba26f414ddab3f0`),
      network_id: 5,       // Ropsten's id
      gas: 20000000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
  },
  compilers: {
    solc: {
      version: "0.6.12",
      settings: {
        optimizer: {
          enabled: true,
          runs: 999999   // Optimize for how many times you intend to run the code
        }
      }
    }    
  },

  plugins: [
    'truffle-plugin-verify',
  ],

  // API
  api_keys: {
    etherscan: process.env.ETHERSCAN_TOKEN
  }

};