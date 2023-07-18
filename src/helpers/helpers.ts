import { BigNumberish, BytesLike, ContractTransaction } from 'ethers';
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

    public createRequestWithoutMetadata(request: IOracle.NewRequestStruct): Promise<ContractTransaction> {
        return this.oracle.createRequest(request);
    }

    public async createRequest(
        request: IOracle.NewRequestStruct, 
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
        return this.oracle['proposeResponse(bytes32,bytes)'](requestId, responseData);
    }

    public proposeResponseWithProposer(proposer: string, requestId: BytesLike,
        responseData: BytesLike): Promise<ContractTransaction> {
        return this.oracle['proposeResponse(address,bytes32,bytes)'](proposer,requestId,responseData);
    }

    public getResponse(responseId: BytesLike): Promise<IOracle.ResponseStructOutput> {
        return this.oracle.getResponse(responseId);
    }

    public getResponseIds(requestId: BytesLike): Promise<string[]> {
        return this.oracle.getResponseIds(requestId);
    }

    public getFinalizedResponse(requestId: BytesLike): Promise<IOracle.ResponseStructOutput> {
        return this.oracle.getFinalizedResponse(requestId);
    }

    public listRequests(
        startFrom: BigNumberish, 
        amount: BigNumberish): Promise<IOracle.FullRequestStructOutput[]>{
        return this.oracle.listRequests(startFrom, amount);
    }

    public disputeResponse(
        requestId: BytesLike,
        responseId: BytesLike): Promise<ContractTransaction> {
        return this.oracle.disputeResponse(requestId, responseId);
    }

    public instantiateModule() {
        // TODO 
    }
    

    public getModules() {
        // TODO 
    }
}
