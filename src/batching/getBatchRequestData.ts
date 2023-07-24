import { Provider } from '@ethersproject/providers';
import { utils } from 'ethers';
import { bytecode } from './abi/BatchRequestsData.json';

const requestDataAbi: any[] = [
  {
    components: [
      { name: 'requestId', type: 'bytes32' },
      {
        name: 'request',
        type: 'tuple',
        components: [
          { name: 'requestModuleData', type: 'bytes' },
          { name: 'responseModuleData', type: 'bytes' },
          { name: 'disputeModuleData', type: 'bytes' },
          { name: 'resolutionModuleData', type: 'bytes' },
          { name: 'finalityModuleData', type: 'bytes' },
          { name: 'ipfsHash', type: 'bytes32' },
          { name: 'requestModule', type: 'address' },
          { name: 'responseModule', type: 'address' },
          { name: 'disputeModule', type: 'address' },
          { name: 'resolutionModule', type: 'address' },
          { name: 'finalityModule', type: 'address' },
          { name: 'requester', type: 'address' },
          { name: 'nonce', type: 'uint256' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'requestId', type: 'bytes32' },
        ],
      },
      {
        name: 'responses',
        type: 'tuple[]',
        components: [
          { name: 'createdAt', type: 'uint256' },
          { name: 'proposer', type: 'address' },
          { name: 'requestId', type: 'bytes32' },
          { name: 'disputeId', type: 'bytes32' },
          { name: 'response', type: 'bytes' },
        ],
      },
      {
        name: 'finalizedResponse',
        type: 'tuple',
        components: [
          { name: 'createdAt', type: 'uint256' },
          { name: 'proposer', type: 'address' },
          { name: 'requestId', type: 'bytes32' },
          { name: 'disputeId', type: 'bytes32' },
          { name: 'response', type: 'bytes' },
        ],
      },
      { name: 'disputeStatus', type: 'uint8' },
    ],
    name: 'RequestData',
    type: 'tuple[]',
  },
];

export interface RequestFullData {
  requestId: string;
  request: {
    requestModuleData: string;
    responseModuleData: string;
    disputeModuleData: string;
    resolutionModuleData: string;
    finalityModuleData: string;
    ipfsHash: string;
    requestModule: string;
    responseModule: string;
    disputeModule: string;
    resolutionModule: string;
    finalityModule: string;
    requester: string;
    nonce: string;
    createdAt: string;
    requestId: string;
  };
  responses: {
    createdAt: string;
    proposer: string;
    requestId: string;
    disputeId: string;
    response: string;
  }[];
  finalizedResponse: {
    createdAt: string;
    proposer: string;
    requestId: string;
    disputeId: string;
    response: string;
  };
  disputeStatus: number;
}

export const getBatchRequestData = async (
  provider: Provider,
  oracleAddress: string,
  startFrom: number,
  amount: number
): Promise<RequestFullData[]> => {
  const inputData = utils.defaultAbiCoder.encode(['address', 'uint256', 'uint256'], [oracleAddress, startFrom, amount]);

  const contractCreationCode = bytecode.concat(inputData.slice(2));
  const returnedData = await provider.call({ data: contractCreationCode });
  const decodedData = utils.defaultAbiCoder.decode(requestDataAbi, returnedData);

  return decodedData[0] as RequestFullData[];
};
