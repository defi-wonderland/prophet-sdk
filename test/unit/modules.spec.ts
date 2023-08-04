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
import { Modules } from '../../src/modules/modules';

describe('Modules', () => {
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

  let modules = new Modules(knownModules);

  it('should return a module given an address', async () => {
    expect(modules.getModule(moduleAddress)).to.be.equal(module);
    expect(modules.getModule(otherModuleAddress)).to.be.equal(otherModule);
  });

  it('should throw an error if the module is not found in the map', async () => {
    let unexistentModule = '0x123';
    expect(() => modules.getModule(unexistentModule)).to.throw(`Module ${unexistentModule} not found`);
  });

  it('should return the correct return types for a module', async () => {
    expect(await modules.getDecodeRequestReturnTypes(moduleAddress)).to.be.equal(
      '(string,string,string,address,address,uint256)'
    );
    expect(await modules.getDecodeRequestReturnTypes(otherModuleAddress)).to.be.equal(
      '(address,address,uint256,uint256)'
    );
  });

  it('should return the correct named return types for a module', async () => {
    expect(await modules.getNamedDecodeRequestReturnTypes(moduleAddress)).to.be.equal(
      '(string _url,string _method,string _body,address _accountingExtension,address _paymentToken,uint256 _paymentAmount)'
    );
    expect(await modules.getNamedDecodeRequestReturnTypes(otherModuleAddress)).to.be.equal(
      '(address _accounting,address _bondToken,uint256 _bondSize,uint256 _deadline)'
    );
  });
});
