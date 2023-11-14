import { expect } from 'chai';
import { Contract, ContractRunner, ethers } from 'ethers';
import { ProphetSDK } from '../../src/oracle';
import config from '../../src/config/config';
import { CONSTANTS } from '../../src/utils/constants';
import { Module } from '../../src/module';

import IHttpRequestModule from '@defi-wonderland/prophet-modules-abi/abi/IHttpRequestModule.json';
import IArbitratorModule from '@defi-wonderland/prophet-modules-abi/abi/IArbitratorModule.json';
import ICallbackModule from '@defi-wonderland/prophet-modules-abi/abi/ICallbackModule.json';
import IBondedResponseModule from '@defi-wonderland/prophet-modules-abi/abi/IBondedResponseModule.json';
import IBondedDisputeModule from '@defi-wonderland/prophet-modules-abi/abi/IBondedDisputeModule.json';

import { address } from './utils/constants';
import { ModulesMap } from '../../src/types/Module';
import { IOracle } from '../../src/types/typechain/IOracle';
import { getDecodeRequestDataFunctionReturnTypes } from '../../src/helpers/helpers';
import IAccountingExtension from '@defi-wonderland/prophet-modules-abi/abi/IAccountingExtension.json';
import { ethers as ethersHardhat } from 'hardhat';

/*
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

  describe('createRequest', () => {
    it('should create a request', async () => {
      const accountingExtension = new Contract(
        address.deployed.ACCOUNTING_EXTENSION,
        IAccountingExtension.abi,
        runner as ContractRunner
      );

      const tokenAddress = '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58';
      const BOND_SIZE = 100;
      const deadline = Math.floor(Date.now() / 1000) + 120;

      // Define the data to be sent for each module
      const requestModuleData = Object.values({
        url: 'https://jsonplaceholder.typicode.com/comments',
        body: 'postId=1',
        method: 0, // GET, see HttpRequestModule
        accountingExtension: address.deployed.ACCOUNTING_EXTENSION,
        paymentToken: tokenAddress,
        paymentAmount: BOND_SIZE,
      });

      const responseModuleData = Object.values({
        accountingExtension: address.deployed.ACCOUNTING_EXTENSION,
        bondToken: tokenAddress,
        bondSize: BOND_SIZE,
        deadline: deadline,
        disputeWindow: 5000,
      });

      const disputeModuleData = Object.values({
        accountingExtension: address.deployed.ACCOUNTING_EXTENSION,
        bondToken: tokenAddress,
        bondSize: BOND_SIZE,
      });

      const resolutionModuleData = [address.wallets.ARBITRATOR];

      const finalityModuleData = Object.values({
        target: address.deployed.ACCOUNTING_EXTENSION,
        data: accountingExtension.interface.encodeFunctionData('revokeModule', [address.deployed.CALLBACK_MODULE]), // drops the finality module
      });

      // Create the new request object
      const newRequest: IOracle.RequestStruct = {
        nonce: 2,
        requestModuleData: ethers.AbiCoder.defaultAbiCoder().encode(
          getDecodeRequestDataFunctionReturnTypes(IHttpRequestModule.abi),
          [requestModuleData]
        ),
        responseModuleData: ethers.AbiCoder.defaultAbiCoder().encode(
          getDecodeRequestDataFunctionReturnTypes(IBondedResponseModule.abi),
          [responseModuleData]
        ),
        disputeModuleData: ethers.AbiCoder.defaultAbiCoder().encode(
          getDecodeRequestDataFunctionReturnTypes(IBondedDisputeModule.abi),
          [disputeModuleData]
        ),
        resolutionModuleData: ethers.AbiCoder.defaultAbiCoder().encode(
          getDecodeRequestDataFunctionReturnTypes(IArbitratorModule.abi),
          resolutionModuleData
        ),
        finalityModuleData: ethers.AbiCoder.defaultAbiCoder().encode(
          getDecodeRequestDataFunctionReturnTypes(ICallbackModule.abi),
          [finalityModuleData]
        ),
        requestModule: address.deployed.HTTP_REQUEST_MODULE,
        responseModule: address.deployed.BONDED_RESPONSE_MODULE,
        disputeModule: address.deployed.BONDED_DISPUTE_MODULE,
        resolutionModule: address.deployed.ARBITRATOR_MODULE,
        finalityModule: address.deployed.CALLBACK_MODULE,
        requester: '0x102EEA73631BaB024C55540B048FEA1e43271962',
      };

      const requestMetadataSample = { responseType: 'uint', description: 'uint', returnedTypes: null };

      const result = await sdk.helpers.createRequest(newRequest, requestMetadataSample);
      console.log(result);
    });
  });

  it('read the first request', async () => {
    const events = await sdk.helpers.listRequests(111060361, 111060362);
    expect(events[0]).to.deep.equal(firstRequest);
  });

  it('should return the request id', async () => {
    const requestId = await sdk.helpers.getRequestId(
      1
    );
    expect(requestId).to.equal('0xecf0806d125a1e9cb75eeb7fddad839139910ae32d686a2c36d4fc669c5790a2');
  });

});

const firstRequest = [
  '0xecf0806d125a1e9cb75eeb7fddad839139910ae32d686a2c36d4fc669c5790a2',
  [
    BigInt(1),
    '0x102EEA73631BaB024C55540B048FEA1e43271962',
    '0x02b0B4EFd909240FCB2Eb5FAe060dC60D112E3a4',
    '0x927b167526bAbB9be047421db732C663a0b77B11',
    '0xfcDB4564c18A9134002b9771816092C9693622e3',
    '0xD42912755319665397FF090fBB63B1a31aE87Cee',
    '0x01c1DeF3b91672704716159C9041Aeca392DdFfb',
    '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040a42baf86fc821f972ad2ac878729063ceef40300000000000000000000000094b008aa00579c1307b0ef2c499ad98a8ce58e580000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000002d68747470733a2f2f6a736f6e706c616365686f6c6465722e74797069636f64652e636f6d2f636f6d6d656e7473000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008706f737449643d31000000000000000000000000000000000000000000000000',
    '0x00000000000000000000000040a42baf86fc821f972ad2ac878729063ceef40300000000000000000000000094b008aa00579c1307b0ef2c499ad98a8ce58e58000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000654521cc0000000000000000000000000000000000000000000000000000000000001388',
    '0x00000000000000000000000040a42baf86fc821f972ad2ac878729063ceef40300000000000000000000000094b008aa00579c1307b0ef2c499ad98a8ce58e580000000000000000000000000000000000000000000000000000000000000064',
    '0x00000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c8',
    '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000040a42baf86fc821f972ad2ac878729063ceef40300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000024a69748b800000000000000000000000001c1def3b91672704716159c9041aeca392ddffb00000000000000000000000000000000000000000000000000000000',
  ],
  BigInt(111060361),
];
*/
