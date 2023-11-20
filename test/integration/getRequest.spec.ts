import { expect } from 'chai';
import { Contract, ContractRunner, ethers } from 'ethers';
import { ProphetSDK } from '../../src/oracle';
import { Module } from '../../src/module';

import IHttpRequestModule from '@defi-wonderland/prophet-modules-abi/abi/IHttpRequestModule.json';
import IArbitratorModule from '@defi-wonderland/prophet-modules-abi/abi/IArbitratorModule.json';
import ICallbackModule from '@defi-wonderland/prophet-modules-abi/abi/ICallbackModule.json';
import IBondedResponseModule from '@defi-wonderland/prophet-modules-abi/abi/IBondedResponseModule.json';
import IBondedDisputeModule from '@defi-wonderland/prophet-modules-abi/abi/IBondedDisputeModule.json';

import { address } from '../constants';
import { ModulesMap } from '../../src/types/Module';
import { IOracle } from '../../src/types/typechain/IOracle';
import IAccountingExtension from '@defi-wonderland/prophet-modules-abi/abi/IAccountingExtension.json';
import { ethers as ethersHardhat } from 'hardhat';
import { RequestWithId } from '../../src/types/types';

describe('Create Requests', () => {
  let sdk: ProphetSDK;
  let runner: ContractRunner;

  beforeEach(async () => {
    // We want to define the ProphetSDK and the provider here

    const [signer] = await ethersHardhat.getSigners();
    runner = signer as unknown as ContractRunner;

    const httpRequestModule = {
      module: new Module(address.deployed.HTTP_REQUEST_MODULE, IHttpRequestModule.abi, runner),
      abi: IHttpRequestModule.abi,
    };

    const bondedResponseModule = new Module(address.deployed.BONDED_RESPONSE_MODULE, IBondedResponseModule.abi, runner);

    const bondedDisputeModule = {
      module: new Module(address.deployed.BONDED_DISPUTE_MODULE, IBondedDisputeModule.abi, runner),
      abi: IBondedDisputeModule.abi,
    };

    const arbitratorModule = {
      module: new Module(address.deployed.ARBITRATOR_MODULE, IArbitratorModule.abi, runner),
      abi: IArbitratorModule.abi,
    };

    const callbackModule = {
      module: new Module(address.deployed.CALLBACK_MODULE, ICallbackModule.abi, runner),
      abi: ICallbackModule.abi,
    };

    const knownModules: ModulesMap = {
      [httpRequestModule.module.moduleAddress]: httpRequestModule.module,
      [address.deployed.BONDED_RESPONSE_MODULE]: bondedResponseModule,
      [bondedDisputeModule.module.moduleAddress]: bondedDisputeModule.module,
      [arbitratorModule.module.moduleAddress]: arbitratorModule.module,
      [callbackModule.module.moduleAddress]: callbackModule.module,
    };

    sdk = new ProphetSDK(runner, address.deployed.ORACLE, knownModules);
  });

  describe('get the request id', () => {
    it('should get the request id', async () => {
      const result = await sdk.helpers.getRequestId(1);
      expect(result).to.be.equal('0xecf0806d125a1e9cb75eeb7fddad839139910ae32d686a2c36d4fc669c5790a2');
    });
  });

  describe('list the requests ids', () => {
    it('list the requests ids', async () => {
      const result = await sdk.helpers.listRequestIds(1, 10);
      const requestsIds = [
        '0xecf0806d125a1e9cb75eeb7fddad839139910ae32d686a2c36d4fc669c5790a2',
        '0x9842e4ea251791f0f8110ee02d49a3359e86375cec3b1692b7b884ad9181879e',
        '0x40b85527d4a2f0ad54e78f3ac3f22e752eaef17eb1ad8faa9d95acef423d1ccd',
        '0x892881a26552de5973645a16d74901c5cea44176ce1995d37afc4c15da6f8cf7',
        '0x24e8f1789e9a8dcc6323d5c489b4aaff01de836000bdaa9f40f3ded638e5befb',
        '0x0838a4b5e15dcbc38c0bdce9e16639ba6c9cba58359dd7c7274308fc362769df',
        '0x131fe740427f8baeb334543ba597e1889fd721fe1dcc195a30a37b2400f1a2e9',
        '0xc620cf238a051f696c79b1490b7c956fa698cc8bbd7aa01d83c7fead63960f7b',
        '0xbe1cda43961b37697903e47fafef9efa6db5b833e2d947b82350bc6151d4e7a5',
        '0xbd88c180740405bcc9b71f54d7d228901cece533e6e9e73fc5814c360c28f9a1',
      ];
      expect(result).to.be.deep.equal(requestsIds);
    });
  });

  describe('getRequest', () => {
    it('should get the request', async () => {
      //console.log(await sdk.helpers.getRequestId(1));
      //console.log(await sdk.helpers.createdAt('0xeb110f2083f06431aadf965d552c7048fef192ed71aa5ea9d27d508f6e622e16'));
      //console.log((result[0] as RequestWithId).requestId);
      //const result = await sdk.helpers.listRequests(111060419, 111060425);

      //await sdk.helpers.getResponse('0xeb110f2083f06431aadf965d552c7048fef192ed71aa5ea9d27d508f6e622e16');
      const result = await sdk.helpers.getResponse(
        '0x28669e20cd81c12f9cbd712a7c93d3dfdd8a58ef134bccad399a0a2f0d77db44'
      );

      const result2 = await sdk.helpers.finalizedAt(
        '0x9db7c902aae32faec367c304e25a61a5ba8271509f7599440052258d5a623c61'
      );
      console.log(result);
    });
  });
});
