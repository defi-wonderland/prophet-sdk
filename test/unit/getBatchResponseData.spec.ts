import { getBatchResponseData } from '../../src/batching/getBatchResponseData';
import { expect } from 'chai';
import config from '../../src/config/config';
import { ethers } from 'ethers';
import { address } from '../constants';

describe('getBatchResponseData', () => {
  const provider = new ethers.JsonRpcProvider(config.RPC_URL);
  it('returns the correct requestId', async () => {
    const result = await getBatchResponseData(
      provider,
      address.deployed.ORACLE,
      '0x4d4bd503b4b2a0f7fba536c0925ce2d168d86af947977b6b4ce4087e08a0b149'
    );

    expect(result[0].responseId).to.equal('0xe999ecee4bddbd12c0ee3f292a8090f863543b61eb5dede70c9f15d59cb9756a');
  });
});
