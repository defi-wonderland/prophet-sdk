import { OpooSDK } from '../oracle';
import { IpfsApi } from '../ipfsApi';

export class Ipfs {

    private sdk: OpooSDK;
    private ipfsApi: IpfsApi;
    
    constructor(sdk: OpooSDK, ipfsApi: IpfsApi) {
        this.sdk = sdk;
        this.ipfsApi = ipfsApi;
    }

    public getResponseType = (): any => {
        // TODO
    }    
}
