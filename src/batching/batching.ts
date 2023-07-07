import { BigNumberish, BytesLike } from 'ethers';
import { IOracle } from '../types/typechain';

export class Batching {

    private oracle: IOracle;
    
    constructor(oracle: IOracle) {
        this.oracle = oracle;
    }

    public listRequests(
        startFrom: BigNumberish, 
        amount: BigNumberish): Promise<IOracle.RequestStructOutput[]>{
        return this.oracle.listRequests(startFrom, amount);
    }

    public getResponseIds(requestId: BytesLike): Promise<string[]> {
        return this.oracle.getResponseIds(requestId);
    }

    public getFinalizedResponse(requestId: BytesLike): Promise<IOracle.ResponseStructOutput> {
        return this.oracle.getFinalizedResponse(requestId);
    }

    public async listResponses(requestId: BytesLike): Promise<IOracle.ResponseStructOutput[]> {
        const responseIds: string[] = await this.getResponseIds(requestId);
        const responses: IOracle.ResponseStructOutput[] = [];
        
        for (const responseId of responseIds) {
            const response: IOracle.ResponseStructOutput = await this.oracle.getResponse(responseId);
            responses.push(response);
        }

        return responses;
    }
}
