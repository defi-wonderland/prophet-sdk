import PinataClient from '@pinata/sdk';
import axios from 'axios';
import './utils/cid';
import { cidToBytes32, isIpfsCID } from './utils/cid';
import { RequestMetadata } from './types/types';
import { CONSTANTS } from './utils';

/**
 * @title IpfsApi class
 * @notice Wrapper for Pinata SDK
 * @dev Uploads metadata to IPFS, and hides the SDK implementation details
 * and hides the sdk implementation details
 */
export class IpfsApi {
  api: PinataClient;

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
  public async uploadMetadata(metadata: RequestMetadata): Promise<string> {
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
    const response = await axios.get<RequestMetadata>(`${CONSTANTS.IPFS_BASE_URL}/${cid}`);
    return response.data;
  }
}
