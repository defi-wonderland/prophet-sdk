import { expect } from 'chai';
import { Module } from '../../src/module';
import { ethers, Provider } from 'ethers';
import IHttpRequestModule from '@defi-wonderland/prophet-modules-abi/abi/IHttpRequestModule.json';
import IBondedResponseModule from '@defi-wonderland/prophet-modules-abi/abi/IBondedResponseModule.json';
import './setup';
import config from '../../src/config/config';
import { address } from '../constants';

describe('Module', () => {
  let module: Module;
  let otherModule: Module;
  let provider: Provider;

  let iface: ethers.Interface;
  let otherIface: ethers.Interface;

  const moduleName = 'HttpRequestModule';
  const requestData =
    '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004ca5ffe64f7e23bebfc1af987ddab5ddb28787500000000000000000000000094b008aa00579c1307b0ef2c499ad98a8ce58e580000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000002d68747470733a2f2f6a736f6e706c616365686f6c6465722e74797069636f64652e636f6d2f636f6d6d656e7473000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008706f737449643d31000000000000000000000000000000000000000000000000';
  const responseData =
    '0x00000000000000000000000004ca5ffe64f7e23bebfc1af987ddab5ddb28787500000000000000000000000094b008aa00579c1307b0ef2c499ad98a8ce58e58000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000655f2f9b0000000000000000000000000000000000000000000000000000000000001388';

  beforeEach(async () => {
    provider = new ethers.JsonRpcProvider(config.RPC_URL);
    iface = new ethers.Interface(IHttpRequestModule.abi);
    otherIface = new ethers.Interface(IBondedResponseModule.abi);

    module = new Module(address.deployed.HTTP_REQUEST_MODULE, iface, provider);
    otherModule = new Module(address.deployed.BONDED_RESPONSE_MODULE, otherIface, provider);
  });

  describe('constructor', () => {
    it('should throw an error if the module address is invalid', () => {
      expect(new Module('0x0', iface, provider)).to.throw;
    });

    it('should initialize a module correctly', async () => {
      expect(module.moduleAddress).to.equal(address.deployed.HTTP_REQUEST_MODULE);
      expect(await module.moduleContract.getAddress()).to.equal(address.deployed.HTTP_REQUEST_MODULE);
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
      const data = await module.decodeRequestData(requestData);
      const expectedData = [
        'https://jsonplaceholder.typicode.com/comments',
        'postId=1',
        BigInt(0),
        '0x04CA5FFe64f7E23BEBFC1af987DDAB5ddb287875',
        '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
        BigInt(100),
      ];
      expect(data).to.deep.equal(expectedData);
    });

    it('should return the decoded request data for the BondedResponseModule', async () => {
      const data = await otherModule.decodeRequestData(responseData);
      const expectedData = [
        '0x04CA5FFe64f7E23BEBFC1af987DDAB5ddb287875',
        '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
        BigInt(100),
        BigInt(1700736923),
        BigInt(5000),
      ];
      expect(data).to.deep.equal(expectedData);
    });
  });
});
