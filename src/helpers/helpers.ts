import { BytesLike, ContractTransaction } from 'ethers';
import { IOracle } from '../types/typechain';
import { RequestMetadata } from '../types/typeoffchain/typeoffchain';
import { IpfsApi } from '../ipfsApi';

export class Helpers {

    private oracle: IOracle;
    private ipfsApi: IpfsApi;
    
    constructor(oracle: IOracle, ipfsApi: IpfsApi) {
        this.oracle = oracle;
        this.ipfsApi = ipfsApi;
    }

    public createRequest(request: IOracle.RequestStruct): Promise<ContractTransaction> {
        return this.oracle.createRequest(request);
    }

    public async createRequestWithMetadata(
        request: IOracle.RequestStruct, 
        requestMetadata: RequestMetadata): Promise<ContractTransaction> {
        const ipfsHash = await this.ipfsApi.uploadMetadata(requestMetadata);
        request.ipfsHash = ipfsHash;
        return this.oracle.createRequest(request);
    }

    public getRequest(requestId: BytesLike): Promise<IOracle.RequestStructOutput> {
        return this.oracle.getRequest(requestId);
    }

    public proposeResponse(requestId: BytesLike,
        responseData: BytesLike): Promise<ContractTransaction> {
        return this.oracle.proposeResponse(requestId, responseData);
    }

    public getResponse(responseId: BytesLike): Promise<IOracle.ResponseStructOutput> {
        return this.oracle.getResponse(responseId);
    }

    public instantiateModule() {
        // TODO 
    }
    

    public getModules() {
        // TODO 
    }
}
