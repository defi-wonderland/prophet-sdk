import { getBatchRequestData } from '../../src/batching/getBatchRequestData';
import { expect } from 'chai';
import config from '../../src/config/config';
import { ethers } from 'ethers';

describe('getBatchRequestData', () => {
  const provider = new ethers.JsonRpcProvider(config.RPC_URL);
  it('returns the correct requestId', async () => {
    const result = await getBatchRequestData(provider, '0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A', 0, 5);

    expect(result[0].requestId).to.equal('0xd2c0f03c5e0907822f7b5fddbffe9c50173697cb0f26310e691171800c6898cb');
  });

  it('returns the correct module names', async () => {
    const result = await getBatchRequestData(provider, '0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A', 0, 5);

    expect(result[0].requestModuleName).to.equal('HttpRequestModule');
    expect(result[0].responseModuleName).to.equal('BondedResponseModule');
    expect(result[0].disputeModuleName).to.equal('BondedDisputeModule');
    expect(result[0].resolutionModuleName).to.equal('ArbitratorModule');
    expect(result[0].finalityModuleName).to.equal('CallbackModule');
  });
});
