import PinataClient from '@pinata/sdk';
import './utils/cid';
import { cidToBytes32, isIpfsCID } from './utils/cid';
import { RequestMetadata } from './types/types';
import { CONSTANTS } from './utils';

/**
 * @Draft
 * Wrapper for Pinata SDK
 * Uploads metadata to ipfs and hides the sdk implementation details, that can be changed in the future
 */
export class IpfsApi {
  api: PinataClient;

  constructor(apiKey: string, secretApiKey: string) {
    this.api = new PinataClient(apiKey, secretApiKey);
  }

  /**
   * Uploads metadata to IPFS and returns the CID as bytes32 which will be saved on-chain
   * @dev pinata will detect if a json metadata was uploaded before and will return the already uploaded CID
   * @param metadata Contains the request response type and description
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
}
