import { getBatchRequestForFinalizeData } from '../../src/batching/getBatchRequestForFinalizeData';
import { expect } from 'chai';
import config from '../../src/config/config';
import { ethers } from 'ethers';
import { address } from './utils/constants';

const FIRST_REQUEST_ID = '0xbd67002f95e7483bfe53a226c193161a97e00f4d91ae0fda7c734cb418153295';
const FIRST_RESPONSE_ID = '0xf3a70760196c7ad37106eaedf905414bdd2ff9ff17a18a0e78a51173f28d684d';

describe('getBatchRequestData', () => {
  const provider = new ethers.JsonRpcProvider(config.RPC_URL);
  it('returns the correct requestId', async () => {
    const result = await getBatchRequestForFinalizeData(provider, address.deployed.ORACLE, 0, 50);

    expect(result[0].requestId).to.equal(FIRST_REQUEST_ID);
  });

  it('returns the ids of the responses', async () => {
    const result = await getBatchRequestForFinalizeData(provider, address.deployed.ORACLE, 100, 1);

    console.log(result);

    expect(result[0].responses[0]).to.equal(FIRST_RESPONSE_ID);
  });
});
