import { bytecode } from '@defi-wonderland/prophet-batching-abi/abi/BatchDisputesData.json';
import { AbiCoder, ContractRunner } from 'ethers';
import { DisputeData } from '../types';

const disputeDataAbi: any[] = [
  {
    name: 'DisputeData',
    type: 'tuple[]',
    components: [
      { name: 'requestId', type: 'bytes32' },
      { name: 'requestCreatedAt', type: 'uint256' },
      { name: 'isFinalized', type: 'bool' },
      {
        name: 'disputes',
        type: 'tuple[]',
        components: [
          { name: 'disputeId', type: 'bytes32' },
          { name: 'responseId', type: 'bytes32' },
          { name: 'disputeCreatedAt', type: 'uint256' },
          { name: 'responseCreatedAt', type: 'uint256' },
          { name: 'status', type: 'uint8' },
        ],
      },
    ],
  },
];

/**
 * Gets the dispute data for all the requests in the given range
 * @param provider - the RPC provider
 * @param oracleAddress - the address of the oracle
 * @param startFrom - index to start from
 * @param amount - amount of requests to get
 * @returns the dispute data for all the requests in the given range
 */
export const getBatchDisputeData = async (
  provider: ContractRunner,
  oracleAddress: string,
  startFrom: number,
  amount: number
): Promise<DisputeData[]> => {
  const inputData = AbiCoder.defaultAbiCoder().encode(
    ['address', 'uint256', 'uint256'],
    [oracleAddress, startFrom, amount]
  );

  const contractCreationCode = bytecode.concat(inputData.slice(2));
  const returnedData = await provider.call({ data: contractCreationCode });
  const decodedData = AbiCoder.defaultAbiCoder().decode(disputeDataAbi, returnedData);

  return decodedData[0] as DisputeData[];
};
