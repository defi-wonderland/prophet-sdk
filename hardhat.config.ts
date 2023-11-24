import '@nomiclabs/hardhat-ethers';
import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';

dotenv.config({ path: './.env' });
const GOERLI_RPC = typeof process !== 'undefined' ? process.env.GOERLI_RPC : '';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  defaultNetwork: 'tenderly',
  solidity: {
    version: '0.8.19',
  },
  networks: {
    tenderly: {
      chainId: 10,
      url: process.env.RPC_URL || '',
      gas: 20000000,
    },
    local: {
      chainId: 31337,
      url: process.env.LOCAL_RPC || '',
      gas: 20000000,
    },
    // Staging
    optimismGoerli: {
      chainId: 420,
      url: GOERLI_RPC || '',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gas: 20000000,
      gasPrice: 35000000000,
    },

    // Staging tenderly
    tenderlyOptimismGoerli: {
      chainId: 420,
      url: process.env.TENDERLY_OPTIMISM_GOERLI_RPC || '',
      gas: 20000000,
    },
  },
};

export default config;
/* eslint-disable no-undef */
