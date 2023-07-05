import { BytesLike, ContractTransaction } from 'ethers';
import { OpooSDK } from '../oracle';
import { IOracle } from '../types/typechain';
import { RequestMetadata } from '../types/typeoffchain/typeoffchain';
import { IpfsApi } from '../ipfsApi';

export class Helpers {

    private sdk: OpooSDK;
    private ipfsApi: IpfsApi;
    
    constructor(sdk: OpooSDK, ipfsApi: IpfsApi) {
        this.sdk = sdk;
        this.ipfsApi = ipfsApi;
    }

    public createRequest(request: IOracle.RequestStruct): Promise<ContractTransaction> {
        return this.sdk.oracle.createRequest(request);
    }

    public async createRequestWithMetadata(
        request: IOracle.RequestStruct, 
        requestMetadata: RequestMetadata): Promise<ContractTransaction> {
        const ipfsHash = await this.ipfsApi.uploadMetadata(requestMetadata);
        request.ipfsHash = ipfsHash;
        return this.sdk.oracle.createRequest(request);
    }

    public getRequest(requestId: BytesLike): Promise<IOracle.RequestStructOutput> {
        return this.sdk.oracle.getRequest(requestId);
    }

    public proposeResponse(requestId: BytesLike,
        responseData: BytesLike): Promise<ContractTransaction> {
        return this.sdk.oracle.proposeResponse(requestId, responseData);
    }

    public instantiateModule() {
        // TODO 
    }
    

    public getModules() {
        // TODO 
    }
}
