import { expect } from 'chai';
import { Contract, ContractRunner, ethers } from 'ethers';
import { ProphetSDK } from '../../src/oracle';
import { Module } from '../../src/module';

import IHttpRequestModule from '@defi-wonderland/prophet-modules-abi/abi/IHttpRequestModule.json';
import IArbitratorModule from '@defi-wonderland/prophet-modules-abi/abi/IArbitratorModule.json';
import ICallbackModule from '@defi-wonderland/prophet-modules-abi/abi/ICallbackModule.json';
import IBondedResponseModule from '@defi-wonderland/prophet-modules-abi/abi/IBondedResponseModule.json';
import IBondedDisputeModule from '@defi-wonderland/prophet-modules-abi/abi/IBondedDisputeModule.json';

import { BOND_SIZE, DEADLINE, address } from '../constants';
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
      deadline: DEADLINE,
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

    const totalRequestCount = await sdk.helpers.totalRequestCount();
    const nonce = Number(totalRequestCount);

    // Create the new request object
    newRequest = {
      nonce: nonce,
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
        [resolutionModuleData]
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
      requester: runner['address'],
    };
  });

  describe('disputeResponse', () => {
    beforeEach(async () => {
      await sdk.helpers.createRequest(newRequest, requestMetadataSample);
    });

    it('dispute a response', async () => {
      const totalRequestCount = await sdk.helpers.totalRequestCount();
      const requestId = (await sdk.helpers.listRequestIds(Number(totalRequestCount) - 1, totalRequestCount))[0];

      const response: IOracle.ResponseStruct = {
        proposer: runner['address'],
        requestId: requestId,
        response: ethers.AbiCoder.defaultAbiCoder().encode(['uint'], [1]),
      };

      await sdk.helpers.proposeResponse(newRequest, response);

      const responseId = (await sdk.helpers.getResponseIds(requestId))[0];

      const dispute: IOracle.DisputeStruct = {
        disputer: runner['address'],
        proposer: runner['address'],
        responseId: responseId,
        requestId: requestId,
      };

      const disputeResult = await sdk.helpers.disputeResponse(newRequest, response, dispute);
      expect(disputeResult.nonce).to.be.greaterThan(0);
    });
  });
});
