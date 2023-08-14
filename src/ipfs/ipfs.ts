import { IpfsApi } from '../ipfsApi';
import { RequestMetadata } from '../types/types';
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
   * Given an ipfs hash in bytes format, converts the hash to cid and returns the metadata for it
   * @param ipfsHash - The ipfs hash of the request in bytes format to get the metadata for
   * @returns the RequestMetadata for the ipfsHash
   */
  public getMetadata = async (ipfsHash: string): Promise<RequestMetadata> => {
    const cid = bytes32ToCid(ipfsHash);
    const metadata = await this.ipfsApi.getMetadata(cid);
    return metadata;
  };

  /**
   * Gets the response type for a request
   * @param ipfsHash - The ipfs hash of the request in bytes format to get the response type for
   * @returns the response type for the request
   */
  public getResponseType = async (ipfsHash: string): Promise<string> => {
    const metadata = await this.getMetadata(ipfsHash);
    return metadata.responseType;
  };

  /**
   * Gets the returned types of each module for a request
   * @param ipfsHash - The ipfs hash of the request in bytes format to get the returned types for
   * @returns returned types of each module for a request
   */
  public getReturnedTypes = async (ipfsHash: string): Promise<any> => {
    const metadata = await this.getMetadata(ipfsHash);
    return metadata.returnedTypes;
  };

  /**
   * Given an ipfs hash in bytes format, gets the metadata from ipfs and returns its description
   * @param ipfsHash - The ipfs hash of the request in bytes format to get the description for
   * @returns the RequestMetadata description
   */
  public getDescription = async (ipfsHash: string): Promise<string> => {
    const metadata = await this.getMetadata(ipfsHash);
    return metadata.description;
  };
}
