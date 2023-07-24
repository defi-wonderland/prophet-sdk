import { BytesLike } from 'ethers';
import { IOracle } from '../types/typechain';
import { RequestFullData, getBatchRequestData } from './getBatchRequestData';
import { ResponseData, getBatchResponseData } from './getBatchResponseData';

export class Batching {
  private oracle: IOracle;

  constructor(oracle: IOracle) {
    this.oracle = oracle;
  }

  public async listResponses(requestId: BytesLike): Promise<ResponseData[]> {
    const result = await getBatchResponseData(this.oracle.provider, this.oracle.address, requestId);
    return result;
  }

  public async getFullRequestData(startFrom: number, amount: number): Promise<RequestFullData[]> {
    const result = await getBatchRequestData(this.oracle.provider, this.oracle.address, startFrom, amount);
    return result;
  }
}
