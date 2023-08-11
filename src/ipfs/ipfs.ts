import { IpfsApi } from '../ipfsApi';
import { bytes32ToCid } from '../utils/cid';

/**
 * @title Ipfs class
 * @notice Helper class to compose queries to IPFS
 */
export class Ipfs {
  private ipfsApi: IpfsApi;

  constructor(ipfsApi: IpfsApi) {
    this.ipfsApi = ipfsApi;
  }

  /**
   * Gets the response type for a request
   * @param ipfsHash - The ipfs hash of the request in bytes format to get the response type for
   * @returns the response type for the request
   */
  public getResponseType = async (ipfsHash: string): Promise<string> => {
    const cid = bytes32ToCid(ipfsHash);
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
