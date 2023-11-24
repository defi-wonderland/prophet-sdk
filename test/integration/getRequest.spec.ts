import { expect } from 'chai';
import { ContractRunner } from 'ethers';
import { ProphetSDK } from '../../src/oracle';
import { Module } from '../../src/module';

import IHttpRequestModule from '@defi-wonderland/prophet-modules-abi/abi/IHttpRequestModule.json';
import IArbitratorModule from '@defi-wonderland/prophet-modules-abi/abi/IArbitratorModule.json';
import ICallbackModule from '@defi-wonderland/prophet-modules-abi/abi/ICallbackModule.json';
import IBondedResponseModule from '@defi-wonderland/prophet-modules-abi/abi/IBondedResponseModule.json';
import IBondedDisputeModule from '@defi-wonderland/prophet-modules-abi/abi/IBondedDisputeModule.json';

import { address } from '../constants';
import { ModulesMap } from '../../src/types/Module';
import { ethers as ethersHardhat } from 'hardhat';

describe('Create Requests', () => {
  let sdk: ProphetSDK;
  let runner: ContractRunner;

  beforeEach(async () => {
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

  describe('list the requests ids', () => {
    it('list the requests ids', async () => {
      const result = await sdk.helpers.listRequestIds(1, 10);

      const requestsIds = [
        '0xf78a5f41aa0cfc974adfff66f7058ca9c2ff3243d521a0d239ef57c889d16aa1',
        '0x357045d3c381382abbc44e069711bc00b3e767e5679791edf50aabd94ba5b4dc',
        '0xe69fca4aa31a2ddebc60dfa09ce6acc5fc02a58ff302f8686916c8da17a8b9c6',
        '0xf74f65d42b6975b24335e3bd86bdbd60ddfafe2f5ba5ac4cced213d39aa56fb4',
        '0x2a7b36fc72644328e7526a3d455b1cf9462bb0dc4a26d0777a6a6016a361ee08',
        '0xc87bc2312bb97d7413c4c929dbccf2c645e4ddb660f321bf3e34cc46800ee6ee',
        '0x14cc0b61491e41afced4b24624c69f5d24aec7491631e9047a84c38df27e15b0',
        '0xe52589e27c761cdf7a3db9164060294790a953b28af602386ee6700e519a0777',
        '0xbf6483398ce022ee7f8f1a5b86a1510cbace58df533f83fc07c6b57ce658a0eb',
        '0x346329bee294d95bc868a025646651867e2e6262d0ddbe2e3b36557494040b99',
      ];
      expect(result).to.be.deep.equal(requestsIds);
    });
  });

  describe('getRequest', () => {
    it('should get the request', async () => {
      const requestsIds = await sdk.helpers.listRequestIds(1, 10);

      const result = await sdk.helpers.getRequest(requestsIds[0]);

      expect(result.blockNumber).to.be.equal(BigInt(111060507));
    });
  });
});
