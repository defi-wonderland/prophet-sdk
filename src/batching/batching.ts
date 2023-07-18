import { BytesLike } from 'ethers';
import { IOracle } from '../types/typechain';
import { RequestFullData, getBatchRequestData } from '../utils/getBatchRequestData';

export class Batching {

    private oracle: IOracle;
    
    constructor(oracle: IOracle) {
        this.oracle = oracle;
    }

    public async listResponses(requestId: BytesLike): Promise<IOracle.ResponseStructOutput[]> {
        const responseIds: string[] = await this.oracle.getResponseIds(requestId);
        const responses: IOracle.ResponseStructOutput[] = [];
        
        for (const responseId of responseIds) {
            const response: IOracle.ResponseStructOutput = await this.oracle.getResponse(responseId);
            responses.push(response);
        }

        return responses;
    }

    public async getFullRequestData(startFrom: number, amount: number): Promise<RequestFullData[]> {
        const result = await getBatchRequestData(this.oracle.provider, this.oracle.address, startFrom, amount);
        return result;
    }
}
