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
import { getDecodeRequestDataFunctionReturnTypes } from '../../src/helpers/helpers';
import IAccountingExtension from '@defi-wonderland/prophet-modules-abi/abi/IAccountingExtension.json';
import { ethers as ethersHardhat } from 'hardhat';

describe('Create Requests', () => {
  let sdk: ProphetSDK;
  let runner: ContractRunner;
  let accountingExtension: Contract;
  let newRequest: IOracle.RequestStruct;
  const requestMetadataSample = { responseType: 'uint', description: 'uint', returnedTypes: null };

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

    accountingExtension = new Contract(
      address.deployed.ACCOUNTING_EXTENSION,
      IAccountingExtension.abi,
      runner as ContractRunner
    );

    sdk = new ProphetSDK(runner, address.deployed.ORACLE, knownModules);

    const tokenAddress = address.usdt;
    const BOND_SIZE = 100;
    const deadline = Math.floor(Date.now() / 1000) + 120;
  });

  describe('approveModules', () => {
    it('should approve the modules', async () => {
      // console.log( await accountingExtension.approveModule(address.deployed.HTTP_REQUEST_MODULE));
      // console.log(await accountingExtension.approveModule(address.deployed.BONDED_RESPONSE_MODULE));
      //console.log(await accountingExtension.approveModule(address.deployed.BONDED_DISPUTE_MODULE));
      //console.log(await accountingExtension.approveModule(address.deployed.ARBITRATOR_MODULE));
      //console.log(await accountingExtension.approveModule(address.deployed.CALLBACK_MODULE));
      await accountingExtension.deposit('0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', 10000);
    });
  });
});
