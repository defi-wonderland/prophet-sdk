import '@nomiclabs/hardhat-ethers';
import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';

dotenv.config({ path: './.env' });
const ALCHEMY_ID = typeof process !== 'undefined' ? process.env.ALCHEMY_ID : '';
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
      url: process.env.CUSTOM_LOCAL_RPC || '',
      gas: 20000000,
    },
    // Staging
    optimismGoerli: {
      chainId: 420,
      url: `https://opt-goerli.g.alchemy.com/v2/${ALCHEMY_ID}` || '',
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
