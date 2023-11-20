import { expect } from 'chai';
import { ethers, Provider } from 'ethers';
import { ProphetSDK } from '../../src/oracle';
import config from '../../src/config/config';
import { CONSTANTS } from '../../src/utils/constants';
import { address } from '../constants';
import { ModulesMap } from '../../src/types/Module';
import sinon, { SinonStub } from 'sinon';

describe('ProphetSDK', () => {
  let sdk: ProphetSDK;
  let provider: Provider;
  const knownModules: ModulesMap = {
    [address.deployed.ARBITRATOR_MODULE]: sinon.stub(),
    [address.deployed.BONDED_DISPUTE_MODULE]: sinon.stub(),
    [address.deployed.BONDED_RESPONSE_MODULE]: sinon.stub(),
    [address.deployed.CALLBACK_MODULE]: sinon.stub(),
    [address.deployed.HTTP_REQUEST_MODULE]: sinon.stub(),
  };

  beforeEach(async () => {
    // We want to define the ProphetSDK and the provider here
    provider = new ethers.JsonRpcProvider(config.RPC_URL);

    sdk = new ProphetSDK(provider, address.deployed.ORACLE, knownModules);
  });

  describe('constructor', () => {
    it('should throw an error if the rpc is invalid', () => {
      const provider = new ethers.JsonRpcProvider('0xBAD');
      expect(new ProphetSDK(provider, address.deployed.ORACLE, knownModules)).to.throw;
    });

    it('should throw an error if the oracle address is invalid', () => {
      expect(new ProphetSDK(provider, '0x00', knownModules)).to.throw;
    });

    it('should initialize oracle correctly', async () => {
      expect(await sdk.oracle.getAddress()).to.equal(address.deployed.ORACLE);
      expect(sdk.runner).to.be.an.instanceOf(ethers.JsonRpcProvider);
    });
  });
});
