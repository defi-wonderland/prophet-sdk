import PinataClient from '@pinata/sdk';
import axios from 'axios';
import './utils/cid';
import { cidToBytes32, isIpfsCID } from './utils/cid';
import { RequestMetadata } from './types/types';
import { CONSTANTS } from './utils';
import { BytesLike } from 'ethers';

/**
 * @title IpfsApi class
 * @notice Wrapper for Pinata SDK
 * @dev Uploads metadata to IPFS, and hides the SDK implementation details
 * and hides the sdk implementation details
 */
export class IpfsApi implements IIpfsApi {
  api: PinataClient;
  alternativeIpfsUrls: string[] = [CONSTANTS.IPFS_ALTERNATIVE_URL];

  constructor(apiKey: string, secretApiKey: string) {
    this.api = new PinataClient(apiKey, secretApiKey);
    axios.defaults.timeout = CONSTANTS.AXIOS_TIMEOUT;
  }

  /**
   * Uploads metadata to IPFS and returns the CID as bytes32 which will be saved on-chain
   * @dev Pinata API will detect if a json metadata was uploaded before and will return the already uploaded CID
   * @param metadata - Contains the request response type and description
   * @return CID as bytes32
   */
  public async uploadMetadata(metadata: RequestMetadata): Promise<BytesLike> {
    const pinataPayload = {
      pinataOptions: {
        cidVersion: CONSTANTS.CID_VERSION, // Since we are using base58 encoding, CID version must be 0
      },
      pinataMetadata: {
        name: `${metadata.responseType}_${metadata.description}`,
      },
      pinataContent: metadata,
    };
    const result = await this.api.pinJSONToIPFS(pinataPayload);
    if (!isIpfsCID(result.IpfsHash)) throw new Error(`Invalid IPFS CID: ${result.IpfsHash}`);
    return cidToBytes32(result.IpfsHash);
  }

  /**
   * Gets the request metadata from IPFS
   * @param cid - the CID to retrieve the metadata from IPFS
   * @return RequestMetadata that contains responseType and description
   **/
  public async getMetadata(cid: string): Promise<RequestMetadata> {
    const ipfsUrls = [CONSTANTS.IPFS_BASE_URL, ...this.alternativeIpfsUrls];

    for (const url of ipfsUrls) {
      try {
        const response = await axios.get<RequestMetadata>(`${url}/${cid}`);
        return response.data;
      } catch (error) {
        /* eslint-env node */
        console.error(`Failed to get metadata from ${url}/${cid}`, error);
      }
    }

    throw new Error(`Failed to get metadata from ${cid}`);
  }

  /**
   * Add alternative IPFS urls to try if the default one fails
   * @param urls - The urls to add
   */
  public addAlternativeIpfsUrls(urls: string[]) {
    this.alternativeIpfsUrls = [...this.alternativeIpfsUrls, ...urls];
  }
}

/**
 * @title IIpfsApi interface
 * @notice Interface for IpfsApi
 */
export interface IIpfsApi {
  uploadMetadata(metadata: RequestMetadata): Promise<BytesLike>;
  getMetadata(cid: string): Promise<RequestMetadata>;
  addAlternativeIpfsUrls(urls: string[]): void;
}
