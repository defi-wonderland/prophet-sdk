import { getBatchRequestData } from '../../src/batching/getBatchRequestData';
import { expect } from 'chai';
import config from '../../src/config/config';
import { ethers } from 'ethers';
import { address } from '../constants';

describe('getBatchRequestData', () => {
  const provider = new ethers.JsonRpcProvider(config.RPC_URL);
  it('returns the correct requestId', async () => {
    const result = await getBatchRequestData(provider, address.deployed.ORACLE, 12, 10);

    expect(result[0].requestId).to.equal('0x8dbdf79925e7fbfefb8398430d267d12406c59b3c37a4de5cd2f3989f6d2b5b2');
  });

  it('returns the ids of the responses', async () => {
    const result = await getBatchRequestData(provider, address.deployed.ORACLE, 12, 10);

    expect(result[0].responses[0].responseId).to.equal(
      '0x42ef2329cb6a422043e64acd96eee7381a3536dce590a1a590f350576bab52cc'
    );
  });
});
