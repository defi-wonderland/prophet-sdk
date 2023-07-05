import { BigNumberish } from 'ethers';
import { OpooSDK } from '../oracle';
import { IOracle } from '../types/typechain';

export class Batching {

    private sdk: OpooSDK;
    
    constructor(sdk: OpooSDK) {
        this.sdk = sdk;
    }

    public listRequests(
        startFrom: BigNumberish,
        amount: BigNumberish
      ): Promise<IOracle.RequestStructOutput[]>{
        return this.sdk.oracle.listRequests(startFrom, amount);
    }
}
