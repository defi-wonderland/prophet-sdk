import { expect } from 'chai';
import { Module } from '../../src/module';
import { Provider, ethers } from 'ethers';
import IHttpRequestModule from '@defi-wonderland/prophet-core-abi/abi/IHttpRequestModule.json';
import IBondedResponseModule from '@defi-wonderland/prophet-core-abi/abi/IBondedResponseModule.json';
import './setup';
import config from '../../src/config/config';
import { ModulesMap } from '../../src/types/Module';
import { Modules } from '../../src/modules/modules';

describe('Modules', () => {
  let module: Module;
  let otherModule: Module;
  let provider: Provider;

  let iface: ethers.Interface;
  let otherIface: ethers.Interface;

  const moduleAddress = '0x7969c5eD335650692Bc04293B07F5BF2e7A673C0';
  const otherModuleAddress = '0xCD8a1C3ba11CF5ECfa6267617243239504a98d90';
  const tupleModuleAddres = '0xCD8a1C3ba11CF5ECfa6267617243239504a98d91';

  provider = new ethers.JsonRpcProvider(config.RPC_URL);
  iface = new ethers.Interface(IHttpRequestModule.abi);
  otherIface = new ethers.Interface(IBondedResponseModule.abi);

  module = new Module(moduleAddress, iface, provider);
  otherModule = new Module(otherModuleAddress, otherIface, provider);

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
    '0x7969c5eD335650692Bc04293B07F5BF2e7A673C0': module,
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
});
