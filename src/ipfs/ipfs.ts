import { BytesLike } from 'ethers';
import { IpfsApi } from '../ipfsApi';
import { IOracle } from '../types/typechain';
import { bytes32ToCid } from '../utils/cid';

/**
 * @title Ipfs class
 * @notice Helper class to compose complex queries to IPFS
 */
export class Ipfs {
  private oracle: IOracle;
  private ipfsApi: IpfsApi;

  constructor(oracle: IOracle, ipfsApi: IpfsApi) {
    this.oracle = oracle;
    this.ipfsApi = ipfsApi;
  }

  /**
   * Gets the response type for a request
   * @param requestId - The request id to get the response type for
   * @returns the response type for the request
   */
  public getResponseType = async (requestId: BytesLike): Promise<string> => {
    const request = await this.oracle.getRequest(requestId);
    const cid = bytes32ToCid(request.ipfsHash);
    const metadata = await this.ipfsApi.getMetadata(cid);
    return metadata.responseType;
  };

  /**
   * Gets the returned types of each module for a request
   * @param ipfsHash - The ipfs hash of the request in bytes format to get the returned types for
   * @returns returned types of each module for a request
   */
  public getReturnedTypes = async (ipfsHash: string): Promise<any> => {
    const cid = bytes32ToCid(ipfsHash);
    const metadata = await this.ipfsApi.getMetadata(cid);
    return metadata.returnedTypes;
  };
}
