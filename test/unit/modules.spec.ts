import { expect } from 'chai';
import { Module } from '../../src/module';
import { Provider, ethers } from 'ethers';
import IHttpRequestModule from '@defi-wonderland/prophet-modules-abi/abi/IHttpRequestModule.json';
import IBondedResponseModule from '@defi-wonderland/prophet-modules-abi/abi/IBondedResponseModule.json';
import './setup';
import config from '../../src/config/config';
import { ModulesMap } from '../../src/types/Module';
import { Modules } from '../../src/modules/modules';
import { address } from '../constants';

describe('Modules', () => {
  let module: Module;
  let otherModule: Module;
  let provider: Provider;

  let iface: ethers.Interface;
  let otherIface: ethers.Interface;

  const moduleAddress = address.deployed.HTTP_REQUEST_MODULE;
  const otherModuleAddress = '0xCD8a1C3ba11CF5ECfa6267617243239504a98d90';
  const tupleModuleAddres = '0xCD8a1C3ba11CF5ECfa6267617243239504a98d91';

  provider = new ethers.JsonRpcProvider(config.RPC_URL);
  iface = new ethers.Interface(IHttpRequestModule.abi);
  otherIface = new ethers.Interface(IBondedResponseModule.abi);

  module = new Module(moduleAddress, iface, provider);
  otherModule = new Module(otherModuleAddress, otherIface, provider);

  const requestObject = [
    'https://jsonplaceholder.typicode.com/comments',
    'postId=1',
    BigInt(0),
    '0x04CA5FFe64f7E23BEBFC1af987DDAB5ddb287875',
    '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    BigInt(100),
  ];

  const requestData =
    '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004ca5ffe64f7e23bebfc1af987ddab5ddb28787500000000000000000000000094b008aa00579c1307b0ef2c499ad98a8ce58e580000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000002d68747470733a2f2f6a736f6e706c616365686f6c6465722e74797069636f64652e636f6d2f636f6d6d656e7473000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008706f737449643d31000000000000000000000000000000000000000000000000';

  // Test data
  const tupleModuleAbi = {
    abi: [
      {
        inputs: [
          {
            internalType: 'bytes32',
            name: '_requestId',
            type: 'bytes32',
          },
        ],
        name: 'decodeRequestData',
        outputs: [
          { name: 'requestId', type: 'bytes32' },
          {
            name: 'data',
            type: 'tuple',
            components: [
              {
                internalType: 'uint256',
                name: 'createdAt',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'disputer',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'proposer',
                type: 'address',
              },
              {
                internalType: 'bytes32',
                name: 'responseId',
                type: 'bytes32',
              },
              {
                internalType: 'bytes32',
                name: 'requestId',
                type: 'bytes32',
              },
              {
                internalType: 'enum IOracle.DisputeStatus',
                name: 'status',
                type: 'uint8',
              },
            ],
          },
          { name: 'req2', type: 'address' },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'createdAt',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'disputer',
                type: 'address',
              },
              {
                internalType: 'address',
                name: 'proposer',
                type: 'address',
              },
              {
                internalType: 'bytes32',
                name: 'responseId',
                type: 'bytes32',
              },
              {
                internalType: 'bytes32',
                name: 'requestId',
                type: 'bytes32',
              },
              {
                internalType: 'enum IOracle.DisputeStatus',
                name: 'status',
                type: 'uint8',
              },
            ],
            internalType: 'struct IOracle.Dispute',
            name: '_dispute',
            type: 'tuple',
          },
          { name: 'testEnd', type: 'uint256' },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
  };

  const tupleModule = new Module(tupleModuleAddres, new ethers.Interface(tupleModuleAbi.abi), provider);

  let knownModules: ModulesMap = {
    [address.deployed.HTTP_REQUEST_MODULE]: module,
    '0xCD8a1C3ba11CF5ECfa6267617243239504a98d90': otherModule,
    '0xCD8a1C3ba11CF5ECfa6267617243239504a98d91': tupleModule,
  };

  let modules = new Modules(knownModules);

  const expectedReturnTypesModule = [
    {
      type: 'tuple',
      components: [
        { type: 'string' },
        { type: 'string' },
        { type: 'uint8' },
        { type: 'address' },
        { type: 'address' },
        { type: 'uint256' },
      ],
    },
  ];

  const expectedReturnTypesOtherModule = [
    {
      type: 'tuple',
      components: [
        { type: 'address' },
        { type: 'address' },
        { type: 'uint256' },
        { type: 'uint256' },
        { type: 'uint256' },
      ],
    },
  ];

  const expectedNamedReturnTypesModule = [
    {
      name: '_params',
      type: 'tuple',
      components: [
        { name: 'url', type: 'string' },
        { name: 'body', type: 'string' },
        { name: 'method', type: 'uint8' },
        { name: 'accountingExtension', type: 'address' },
        { name: 'paymentToken', type: 'address' },
        { name: 'paymentAmount', type: 'uint256' },
      ],
    },
  ];

  const expectedNamedReturnTypesOtherModule = [
    {
      name: '_params',
      type: 'tuple',
      components: [
        { name: 'accountingExtension', type: 'address' },
        { name: 'bondToken', type: 'address' },
        { name: 'bondSize', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
        { name: 'disputeWindow', type: 'uint256' },
      ],
    },
  ];

  const expectedTupleModuleReturnTypes = [
    {
      type: 'bytes32',
    },
    {
      type: 'tuple',
      components: [
        {
          type: 'uint256',
        },
        {
          type: 'address',
        },
        {
          type: 'address',
        },
        {
          type: 'bytes32',
        },
        {
          type: 'bytes32',
        },
        {
          type: 'uint8',
        },
      ],
    },
    {
      type: 'address',
    },
    {
      type: 'tuple',
      components: [
        {
          type: 'uint256',
        },
        {
          type: 'address',
        },
        {
          type: 'address',
        },
        {
          type: 'bytes32',
        },
        {
          type: 'bytes32',
        },
        {
          type: 'uint8',
        },
      ],
    },
    {
      type: 'uint256',
    },
  ];

  const expectedTupleModuleNamedReturnTypes = [
    {
      name: 'requestId',
      type: 'bytes32',
    },
    {
      name: 'data',
      type: 'tuple',
      components: [
        {
          name: 'createdAt',
          type: 'uint256',
        },
        {
          name: 'disputer',
          type: 'address',
        },
        {
          name: 'proposer',
          type: 'address',
        },
        {
          name: 'responseId',
          type: 'bytes32',
        },
        {
          name: 'requestId',
          type: 'bytes32',
        },
        {
          name: 'status',
          type: 'uint8',
        },
      ],
    },
    {
      name: 'req2',
      type: 'address',
    },
    {
      name: '_dispute',
      type: 'tuple',
      components: [
        {
          name: 'createdAt',
          type: 'uint256',
        },
        {
          name: 'disputer',
          type: 'address',
        },
        {
          name: 'proposer',
          type: 'address',
        },
        {
          name: 'responseId',
          type: 'bytes32',
        },
        {
          name: 'requestId',
          type: 'bytes32',
        },
        {
          name: 'status',
          type: 'uint8',
        },
      ],
    },
    {
      name: 'testEnd',
      type: 'uint256',
    },
  ];

  it('should return a module given an address', async () => {
    expect(modules.getModule(moduleAddress)).to.be.equal(module);
    expect(modules.getModule(otherModuleAddress)).to.be.equal(otherModule);
  });

  it('should throw an error if the module is not found in the map', async () => {
    let unexistentModule = '0x123';
    expect(() => modules.getModule(unexistentModule)).to.throw(`Module ${unexistentModule} not found`);
  });

  it('should return the correct return types for a module', async () => {
    expect(await modules.getDecodeRequestReturnTypes(moduleAddress)).deep.equal(expectedReturnTypesModule);
    expect(await modules.getDecodeRequestReturnTypes(otherModuleAddress)).deep.equal(expectedReturnTypesOtherModule);
    expect(await modules.getDecodeRequestReturnTypes(tupleModuleAddres)).deep.equal(expectedTupleModuleReturnTypes);
  });

  it('should return the correct named return types for a module', async () => {
    expect(await modules.getNamedDecodeRequestReturnTypes(moduleAddress)).deep.equal(expectedNamedReturnTypesModule);
    expect(await modules.getNamedDecodeRequestReturnTypes(otherModuleAddress)).deep.equal(
      expectedNamedReturnTypesOtherModule
    );
    expect(await modules.getNamedDecodeRequestReturnTypes(tupleModuleAddres)).deep.equal(
      expectedTupleModuleNamedReturnTypes
    );
  });

  describe('encodeRequestData', () => {
    it('should encode the request data correctly', async () => {
      const encodedRequestData = await modules.encodeRequestData(moduleAddress, requestObject);

      expect(encodedRequestData).to.be.equal(requestData);
    });
  });

  describe('decodeRequestData', () => {
    it('should decode the request data correctly', async () => {
      const decodedRequestData = await modules.decodeRequestData(moduleAddress, requestData);

      expect(decodedRequestData).to.deep.equal([requestObject]);
    });
  });
});
