import { BytesLike } from 'ethers';
import { IOracle } from '../types/typechain';
import { RequestFullData, getBatchRequestData } from './getBatchRequestData';
import { ResponseData, getBatchResponseData } from './getBatchResponseData';

/**
 * @title Batching class
 * @notice Contains methods for batching operations like getting multiple responses or requests
 * that require multiple calls to the rpc
 **/
export class Batching {
  private oracle: IOracle;

  constructor(oracle: IOracle) {
    this.oracle = oracle;
  }

  /**
   * Lists responses for a given request id
   * @dev uses getBatchResponseData to get responses which is a batched call for the BatchResponsesData contract
   * @param requestId - request id to get responses for
   * @returns array of responses
   **/
  public async listResponses(requestId: BytesLike): Promise<ResponseData[]> {
    const result = await getBatchResponseData(this.oracle.provider, this.oracle.address, requestId);
    return result;
  }

  /**
   * Paginates requests starting from the given index
   * @param startFrom - index to start from
   * @param amount - amount of requests to get
   * @returns array of RequestFullData objects that include the request, its responses, and dispute status
   **/
  public async getFullRequestData(startFrom: number, amount: number): Promise<RequestFullData[]> {
    const result = await getBatchRequestData(this.oracle.provider, this.oracle.address, startFrom, amount);
    return result;
  }
}
