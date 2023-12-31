import { bytecode } from '@defi-wonderland/prophet-batching-abi/abi/BatchRequestsForFinalizeData.json';
import { AbiCoder, ContractRunner } from 'ethers';
import { RequestForFinalizeData } from '../types';

/**
 * Represents the data returned from the BatchRequestsForFinalizeData contract
 */
const requestDataAbi: any[] = [
  {
    components: [
      { name: 'requestId', type: 'bytes32' },
      { name: 'requestCreatedAt', type: 'uint256' },
      { name: 'finalizedAt', type: 'uint256' },
      {
        components: [
          { name: 'responseId', type: 'bytes32' },
          { name: 'responseCreatedAt', type: 'uint256' },
        ],
        name: 'responses',
        type: 'tuple[]',
      },
    ],
    name: 'RequestForFinalizeData',
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
export const getBatchRequestForFinalizeData = async (
  provider: ContractRunner,
  oracleAddress: string,
  startFrom: number,
  amount: number
): Promise<RequestForFinalizeData[]> => {
  const inputData = AbiCoder.defaultAbiCoder().encode(
    ['address', 'uint256', 'uint256'],
    [oracleAddress, startFrom, amount]
  );

  const contractCreationCode = bytecode.concat(inputData.slice(2));
  const returnedData = await provider.call({ data: contractCreationCode });
  const decodedData = AbiCoder.defaultAbiCoder().decode(requestDataAbi, returnedData);

  return decodedData[0] as RequestForFinalizeData[];
};
