import { getBatchRequestForFinalizeData } from '../../src/batching/getBatchRequestForFinalizeData';
import { expect } from 'chai';
import config from '../../src/config/config';
import { ethers } from 'ethers';
import { address } from '../constants';

const FIRST_REQUEST_ID = '0x346329bee294d95bc868a025646651867e2e6262d0ddbe2e3b36557494040b99';
const FIRST_RESPONSE_ID = '0x5cbffa6ede43c835518c98c5c1b8f040a817c824d3da6db79ecc6d788e5f809f';

describe('getBatchRequestData', () => {
  const provider = new ethers.JsonRpcProvider(config.RPC_URL);
  it('returns the correct requestId', async () => {
    const result = await getBatchRequestForFinalizeData(provider, address.deployed.ORACLE, 10, 1);

    expect(result[0].requestId).to.equal(FIRST_REQUEST_ID);
  });

  it('returns the ids of the responses', async () => {
    const result = await getBatchRequestForFinalizeData(provider, address.deployed.ORACLE, 10, 1);

    expect(result[0].responsesIds[0]).to.equal(FIRST_RESPONSE_ID);
  });
});
