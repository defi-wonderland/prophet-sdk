import { BytesLike } from 'ethers/lib/ethers';
import { IpfsApi } from '../ipfsApi';
import { IOracle } from '../types/typechain';
import { bytes32ToCid } from '../utils/cid';

export class Ipfs {
  private oracle: IOracle;
  private ipfsApi: IpfsApi;

  constructor(oracle: IOracle, ipfsApi: IpfsApi) {
    this.oracle = oracle;
    this.ipfsApi = ipfsApi;
  }

  public getResponseType = async (requestId: BytesLike): Promise<string> => {
    const request = await this.oracle.getRequest(requestId);
    const cid = bytes32ToCid(request.ipfsHash);
    const metadata = await this.ipfsApi.getMetadata(cid);
    return metadata.responseType;
  };
}
