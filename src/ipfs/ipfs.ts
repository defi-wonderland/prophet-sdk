import { IpfsApi } from '../ipfsApi';
import { IOracle } from '../types/typechain';

export class Ipfs {

    private oracle: IOracle;
    private ipfsApi: IpfsApi;
    
    constructor(oracle: IOracle, ipfsApi: IpfsApi) {
        this.oracle = oracle;
        this.ipfsApi = ipfsApi;
    }

    public getResponseType = (): any => {
        // TODO
    }    
}
