import { expect } from 'chai';
import { providers } from 'ethers';
import { Provider } from '@ethersproject/abstract-provider';
import { OpooSDK } from '../../src/oracle';
import config from '../../src/config/config';
import { CONSTANTS } from '../../src/utils/constants';

describe('OpooSDK', () => {
  let sdk: OpooSDK;
  let provider: Provider;

  beforeEach(async () => {
    // We want to define the OpooSDK and the provider here
    provider = new providers.JsonRpcProvider(config.TENDERLY_URL);
    sdk = new OpooSDK(provider);
  });

  describe('constructor', () => {
    it('should throw an error if the rpc is invalid', () => {
      const provider = new providers.JsonRpcProvider('0xBAD');
      expect(new OpooSDK(provider)).to.throw;
    });

    it('should throw an error if the oracle address is invalid', () => {
      expect(new OpooSDK(provider, '0x00')).to.throw;
    });

    it('should initialize oracle correctly', () => {
      expect(sdk.oracle.address).to.equal(CONSTANTS.ORACLE);
      expect(sdk.signerOrProvider).to.be.an.instanceOf(
        providers.JsonRpcProvider
      );
    });
  });
});
