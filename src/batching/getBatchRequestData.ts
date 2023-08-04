import { bytecode } from './abi/BatchRequestsData.json';
import { AbiCoder, ContractRunner } from 'ethers';

/**
 * Represents the data returned from the BatchRequestsData contract
 */
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

/**
 * Gets request data for a given oracle address, startFrom and amount
 * @dev uses the BatchRequestsData contract
 * @param provider - the RPC provider
 * @param oracleAddress - the address of the oracle
 * @param startFrom - index to start from
 * @param amount - amount of requests to get
 * @returns array of RequestFullData objects
 **/
export const getBatchRequestData = async (
  provider: ContractRunner,
  oracleAddress: string,
  startFrom: number,
  amount: number
): Promise<RequestFullData[]> => {
  const inputData = AbiCoder.defaultAbiCoder().encode(
    ['address', 'uint256', 'uint256'],
    [oracleAddress, startFrom, amount]
  );

  const contractCreationCode = bytecode.concat(inputData.slice(2));
  const returnedData = await provider.call({ data: contractCreationCode });
  const decodedData = AbiCoder.defaultAbiCoder().decode(requestDataAbi, returnedData);

  return decodedData[0] as RequestFullData[];
};
