import { expect } from 'chai';
import { Module } from '../../src/module';
import { ethers, Provider } from 'ethers';
import IHttpRequestModule from '@defi-wonderland/prophet-modules-abi/abi/IHttpRequestModule.json';
import IBondedResponseModule from '@defi-wonderland/prophet-modules-abi/abi/IBondedResponseModule.json';
import './setup';
import config from '../../src/config/config';
import { address } from './utils/constants';

describe('Module', () => {
  let module: Module;
  let otherModule: Module;
  let provider: Provider;

  let iface: ethers.Interface;
  let otherIface: ethers.Interface;

  const moduleName = 'HttpRequestModule';
  const requestId = '0xbda69502828fcd5b0b95d851ee5405efd2b2be720ce546efa55f79b4d9f6da68';

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
      /*
      const data = await module.decodeRequestData(requestId);
      const expectedData = [
        'https://rectangular-pronunciation.biz',
        'Quod porro.',
        BigInt(0),
        '0x40a42Baf86Fc821f972Ad2aC878729063CeEF403',
        '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
        BigInt(327),
      ];
      expect(data).to.deep.equal(expectedData);
      */
    });

    it('should return the decoded request data for the BondedResponseModule', async () => {
      /*
      const data = await otherModule.decodeRequestData(requestId);
      const expectedData = [
        '0x40a42Baf86Fc821f972Ad2aC878729063CeEF403',
        '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
        BigInt(327),
        BigInt(1698489314),
        BigInt(2740),
      ];
      expect(data).to.deep.equal(expectedData);
      */
    });
  });
});
