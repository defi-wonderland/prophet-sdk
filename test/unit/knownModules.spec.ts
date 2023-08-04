import { expect } from 'chai';
import { Module } from '../../src/module';
import { providers, utils } from 'ethers';
import { OpooSDK } from '../../src/oracle';
import { Provider } from '@ethersproject/abstract-provider';
import IHttpRequestModule from '../../node_modules/opoo-core/abi/IHttpRequestModule.json';
import IBondedResponseModule from '../../node_modules/opoo-core/abi/IBondedResponseModule.json';
import './setup';
import config from '../../src/config/config';
import { ModulesMap } from '../../src/types/Module';

describe('Known modules', () => {
  let module: Module;
  let otherModule: Module;
  let sdk: OpooSDK;
  let provider: Provider;

  let iface: utils.Interface;
  let otherIface: utils.Interface;

  const moduleAddress = '0x7969c5eD335650692Bc04293B07F5BF2e7A673C0';
  const otherModuleAddress = '0xCD8a1C3ba11CF5ECfa6267617243239504a98d90';

  provider = new providers.JsonRpcProvider(config.TENDERLY_URL);
  sdk = new OpooSDK(provider);
  iface = new utils.Interface(IHttpRequestModule.abi);
  otherIface = new utils.Interface(IBondedResponseModule.abi);

  module = new Module(moduleAddress, iface, sdk);
  otherModule = new Module(otherModuleAddress, otherIface, sdk);

  let knownModules: ModulesMap = {
    '0x7969c5eD335650692Bc04293B07F5BF2e7A673C0': module,
    '0xCD8a1C3ba11CF5ECfa6267617243239504a98d90': otherModule,
  };

  it('should return a Module given an address', async () => {
    expect(knownModules[moduleAddress]).to.be.equal(module);
    expect(knownModules[otherModuleAddress]).to.be.equal(otherModule);
  });
});