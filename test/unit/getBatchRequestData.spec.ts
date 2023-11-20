import { getBatchRequestData } from '../../src/batching/getBatchRequestData';
import { expect } from 'chai';
import config from '../../src/config/config';
import { ethers } from 'ethers';
import { address } from '../constants';

/*
describe('getBatchRequestData', () => {
  const provider = new ethers.JsonRpcProvider(config.RPC_URL);
  it('returns the correct requestId', async () => {
    const result = await getBatchRequestData(provider, address.deployed.ORACLE, 10, 1);

    expect(result[0].requestId).to.equal('0xbda69502828fcd5b0b95d851ee5405efd2b2be720ce546efa55f79b4d9f6da68');
  });

  it('returns the correct module names', async () => {
    const result = await getBatchRequestData(provider, address.deployed.ORACLE, 10, 1);

    expect(result[0].requestModuleName).to.equal('HttpRequestModule');
    expect(result[0].responseModuleName).to.equal('BondedResponseModule');
    expect(result[0].disputeModuleName).to.equal('BondedDisputeModule');
    expect(result[0].resolutionModuleName).to.equal('BondEscalationResolutionModule');
    expect(result[0].finalityModuleName).to.equal('CallbackModule');
  });

  it('returns the ids of the responses', async () => {
    const result = await getBatchRequestData(provider, address.deployed.ORACLE, 10, 1);

    expect(result[0].responses[0].responseId).to.equal(
      '0x6578e5ad13c830c19276c6b7d30ae65d9b2c8cb986e5fcb718d1c11d3f61b51b'
    );
  });
});
*/
