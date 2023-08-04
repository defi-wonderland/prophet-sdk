import { expect } from 'chai';
import { ethers, Provider } from 'ethers';
import { OpooSDK } from '../../src/oracle';
import config from '../../src/config/config';
import { CONSTANTS } from '../../src/utils/constants';

describe('OpooSDK', () => {
  let sdk: OpooSDK;
  let provider: Provider;

  beforeEach(async () => {
    // We want to define the OpooSDK and the provider here
    provider = new ethers.JsonRpcProvider(config.RPC_URL);
    sdk = new OpooSDK(provider);
  });

  describe('constructor', () => {
    it('should throw an error if the rpc is invalid', () => {
      const provider = new ethers.JsonRpcProvider('0xBAD');
      expect(new OpooSDK(provider)).to.throw;
    });

    it('should throw an error if the oracle address is invalid', () => {
      expect(new OpooSDK(provider, '0x00')).to.throw;
    });

    it('should initialize oracle correctly', async () => {
      expect(await sdk.oracle.getAddress()).to.equal(CONSTANTS.ORACLE);
      expect(sdk.runner).to.be.an.instanceOf(ethers.JsonRpcProvider);
    });
  });
});
