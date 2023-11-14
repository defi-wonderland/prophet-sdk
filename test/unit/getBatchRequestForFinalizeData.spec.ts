import { getBatchRequestForFinalizeData } from '../../src/batching/getBatchRequestForFinalizeData';
import { expect } from 'chai';
import config from '../../src/config/config';
import { ethers } from 'ethers';
import { address } from './utils/constants';

const FIRST_REQUEST_ID = '0xbda69502828fcd5b0b95d851ee5405efd2b2be720ce546efa55f79b4d9f6da68';
const FIRST_RESPONSE_ID = '0x6578e5ad13c830c19276c6b7d30ae65d9b2c8cb986e5fcb718d1c11d3f61b51b';

/*
describe('getBatchRequestData', () => {
  const provider = new ethers.JsonRpcProvider(config.RPC_URL);
  it('returns the correct requestId', async () => {
    const result = await getBatchRequestForFinalizeData(provider, address.deployed.ORACLE, 10, 1);

    expect(result[0].requestId).to.equal(FIRST_REQUEST_ID);
  });

  it('returns the ids of the responses', async () => {
    const result = await getBatchRequestForFinalizeData(provider, address.deployed.ORACLE, 10, 1);

    expect(result[0].responses[0]).to.equal(FIRST_RESPONSE_ID);
  });
});
*/
