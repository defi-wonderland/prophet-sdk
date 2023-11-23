import { getBatchModuleNameData } from '../../src/batching/getBatchModuleNameData';
import { expect } from 'chai';
import config from '../../src/config/config';
import { ethers } from 'ethers';
import { address } from '../constants';

describe('getBatchModuleNameData', () => {
  const provider = new ethers.JsonRpcProvider(config.RPC_URL);
  it('returns the correct module names', async () => {
    const moduleAddresses = [
      address.deployed.HTTP_REQUEST_MODULE,
      address.deployed.BONDED_RESPONSE_MODULE,
      address.deployed.BONDED_DISPUTE_MODULE,
      address.deployed.ARBITRATOR_MODULE,
      address.deployed.CALLBACK_MODULE,
    ];
    const result = await getBatchModuleNameData(provider, moduleAddresses);

    expect(result[0]).to.equal('HttpRequestModule');
    expect(result[1]).to.equal('BondedResponseModule');
    expect(result[2]).to.equal('BondedDisputeModule');
    expect(result[3]).to.equal('ArbitratorModule');
    expect(result[4]).to.equal('CallbackModule');
  });
});
