import { Provider } from '@ethersproject/providers';
import { BytesLike, utils } from 'ethers';
import {bytecode} from '../abi/BatchResponseData.json';

const responseAbi: any[] = [
    {
      components: [
        { name: 'createdAt', type: 'uint256' },
        { name: 'proposer', type: 'address' },
        { name: 'requestId', type: 'bytes32' },
        { name: 'disputeId', type: 'bytes32' },
        { name: 'response', type: 'bytes' }
      ],
      name: 'Response',
      type: 'tuple[]'
    }
  ];

  export interface ResponseData {
    createdAt: string;
    proposer: string;
    requestId: string;
    disputeId: string;
    response: string;
  }

export const getBatchResponseData = async (provider: Provider, oracleAddress: string, requestId: BytesLike): Promise<ResponseData[]> => {
    const inputData = utils.defaultAbiCoder.encode(['address', 'bytes32'], [
        oracleAddress,
        requestId
    ]);
    
    const contractCreationCode = bytecode.concat(inputData.slice(2));
    const returnedData = await provider.call({ data: contractCreationCode });
    const decodedData = utils.defaultAbiCoder.decode(responseAbi, returnedData);

    const result = decodedData[0] as ResponseData[];

    return result;
};
