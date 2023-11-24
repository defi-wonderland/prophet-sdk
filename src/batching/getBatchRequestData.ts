import { bytecode } from '@defi-wonderland/prophet-batching-abi/abi/BatchRequestsData.json';
import { AbiCoder, ContractRunner } from 'ethers';
import { RequestData } from '../types';

/**
 * Represents the data returned from the BatchRequestsData contract
 */
const requestDataAbi: any[] = [
  {
    components: [
      { name: 'requestId', type: 'bytes32' },
      {
        name: 'responses',
        type: 'tuple[]',
        components: [
          { name: 'responseId', type: 'bytes32' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'disputeId', type: 'bytes32' },
        ],
      },
      {
        name: 'finalizedResponseId',
        type: 'bytes32',
      },
      { name: 'disputeStatus', type: 'uint8' },
    ],
    name: 'RequestData',
    type: 'tuple[]',
  },
];

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
): Promise<RequestData[]> => {
  const inputData = AbiCoder.defaultAbiCoder().encode(
    ['address', 'uint256', 'uint256'],
    [oracleAddress, startFrom, amount]
  );

  const contractCreationCode = bytecode.concat(inputData.slice(2));
  const returnedData = await provider.call({ data: contractCreationCode });
  const decodedData = AbiCoder.defaultAbiCoder().decode(requestDataAbi, returnedData);

  return decodedData[0] as RequestData[];
};
