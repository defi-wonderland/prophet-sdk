import { expect } from 'chai';
import { Module } from '../../src/module';
import { Provider, ethers } from 'ethers';
import IHttpRequestModule from '@defi-wonderland/prophet-modules-abi/abi/IHttpRequestModule.json';
import IBondedResponseModule from '@defi-wonderland/prophet-modules-abi/abi/IBondedResponseModule.json';
import './setup';
import config from '../../src/config/config';
import { ModulesMap } from '../../src/types/Module';

/*
describe('Known modules', () => {
  let module: Module;
  let otherModule: Module;
  let provider: Provider;

  let iface: ethers.Interface;
  let otherIface: ethers.Interface;

  const moduleAddress = '0x7969c5eD335650692Bc04293B07F5BF2e7A673C0';
  const otherModuleAddress = '0xCD8a1C3ba11CF5ECfa6267617243239504a98d90';

  provider = new ethers.JsonRpcProvider(config.RPC_URL);
  iface = new ethers.Interface(IHttpRequestModule.abi);
  otherIface = new ethers.Interface(IBondedResponseModule.abi);

  module = new Module(moduleAddress, iface, provider);
  otherModule = new Module(otherModuleAddress, otherIface, provider);

  let knownModules: ModulesMap = {
    '0x7969c5eD335650692Bc04293B07F5BF2e7A673C0': module,
    '0xCD8a1C3ba11CF5ECfa6267617243239504a98d90': otherModule,
  };

  it('should return a Module given an address', async () => {
    expect(knownModules[moduleAddress]).to.be.equal(module);
    expect(knownModules[otherModuleAddress]).to.be.equal(otherModule);
  });
});

*/
