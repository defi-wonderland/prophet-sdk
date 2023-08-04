import { expect } from 'chai';
import { Module } from '../../src/module';
import { ethers, Provider } from 'ethers';
import { OpooSDK } from '../../src/oracle';
import IHttpRequestModule from '../../node_modules/opoo-core/abi/IHttpRequestModule.json';
import IBondedResponseModule from '../../node_modules/opoo-core/abi/IBondedResponseModule.json';
import './setup';
import config from '../../src/config/config';

describe('Module', () => {
  let module: Module;
  let otherModule: Module;
  let sdk: OpooSDK;
  let provider: Provider;

  let iface: ethers.Interface;
  let otherIface: ethers.Interface;

  // TODO: move the constants to a constants file
  const moduleName = 'HttpRequestModule';
  const moduleAddress = '0x7969c5eD335650692Bc04293B07F5BF2e7A673C0';
  const requestId = '0x70fcf09a09345be7a687c63fab3c001e973bc571ff3767e14dfdfa108246da24';
  const requestData =
    '0x00000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001600000000000000000000000007bc06c482dead17c0e297afbc32f6e63d38466500000000000000000000000007f5c764cbc14f9669b88837ca1490cca17c316070000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000002e68747470733a2f2f6170692e636f696e6765636b6f2e636f6d2f6170692f76332f73696d706c652f70726963653f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034745540000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001e6964733d657468657265756d2676735f63757272656e636965733d7573640000';

  const otherModuleAddress = '0xCD8a1C3ba11CF5ECfa6267617243239504a98d90';
  const otherRequestData =
    '0x0000000000000000000000007bc06c482dead17c0e297afbc32f6e63d38466500000000000000000000000007f5c764cbc14f9669b88837ca1490cca17c31607000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000648c3819';

  beforeEach(async () => {
    provider = new ethers.JsonRpcProvider(config.RPC_URL);
    sdk = new OpooSDK(provider);
    iface = new ethers.Interface(IHttpRequestModule.abi);
    otherIface = new ethers.Interface(IBondedResponseModule.abi);

    module = new Module(moduleAddress, iface, sdk);
    otherModule = new Module(otherModuleAddress, otherIface, sdk);
  });

  describe('constructor', () => {
    it('should throw an error if the module address is invalid', () => {
      expect(new Module('0x0', iface, sdk)).to.throw;
    });

    it('should initialize a module correctly', async () => {
      expect(module.moduleAddress).to.equal(moduleAddress);
      expect(await module.moduleContract.getAddress()).to.equal(moduleAddress);
    });
  });

  describe('requestData', () => {
    it('should throw an error if the request id is invalid', async () => {
      await expect(module.requestData('0x0')).to.throw;
    });

    it('should return the request data for the HttpRequestModule', async () => {
      const data = await module.requestData(requestId);
      expect(data).to.equal(requestData);
    });

    it('should return the request data for the BondedResponseModule', async () => {
      const data = await otherModule.requestData(requestId);
      expect(data).to.equal(otherRequestData);
    });
  });

  describe('moduleName', () => {
    it('should return the module name', async () => {
      const name = await module.moduleName();
      expect(name).to.equal(moduleName);
    });
  });

  describe('decodeRequestData', () => {
    it('should throw an error if the request id is invalid', async () => {
      await expect(module.decodeRequestData('0x0')).to.throw;
    });

    it('should return the decoded request data for the HttpRequestModule', async () => {
      const data = await module.decodeRequestData(requestId);
      const expectedData = ethers.AbiCoder.defaultAbiCoder().decode(
        ['string', 'string', 'string', 'address', 'address', 'uint256'],
        requestData
      );
      expect(data).to.deep.equal(expectedData);
    });

    it('should return the decoded request data for the BondedResponseModule', async () => {
      const data = await otherModule.decodeRequestData(requestId);
      const expectedData = ethers.AbiCoder.defaultAbiCoder().decode(
        ['address', 'address', 'uint256', 'uint256'],
        otherRequestData
      );
      expect(data).to.deep.equal(expectedData);
    });
  });
});
