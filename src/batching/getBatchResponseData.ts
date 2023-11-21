import { ContractRunner } from 'ethers';
import { AbiCoder, BytesLike } from 'ethers';
import { bytecode } from '@defi-wonderland/prophet-batching-abi/abi/BatchResponsesData.json';

/**
 * Represents the data returned from the BatchResponsesData contract
 **/
const responseAbi: any[] = [
  {
    components: [
      { name: 'responseId', type: 'bytes32' },
      { name: 'createdAt', type: 'uint256' },
      { name: 'disputeId', type: 'bytes32' },
    ],
    name: 'ResponseData',
    type: 'tuple[]',
  },
];

export interface ResponseData {
  responseId: BytesLike;
  createdAt: number;
  disputeId: BytesLike;
}

/**
 * Gets responses for a given request id
 * @dev uses the BatchResponsesData contract
 * @param provider - the RPC provider
 * @param oracleAddress - address of the oracle contract
 * @param requestId - request id to get responses for
 * @returns array of ResponseData objects
 **/
export const getBatchResponseData = async (
  provider: ContractRunner,
  oracleAddress: string,
  requestId: BytesLike
): Promise<ResponseData[]> => {
  const inputData = AbiCoder.defaultAbiCoder().encode(['address', 'bytes32'], [oracleAddress, requestId]);

  const contractCreationCode = bytecode.concat(inputData.slice(2));
  const returnedData = await provider.call({ data: contractCreationCode });
  const decodedData = AbiCoder.defaultAbiCoder().decode(responseAbi, returnedData);

  const result = decodedData[0] as ResponseData[];

  return result;
};
