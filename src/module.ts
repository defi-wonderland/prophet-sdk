import { Contract } from 'ethers';
import { IModule, Address } from './types/Module';
import { OpooSDK } from './oracle';

export class Module implements IModule {
    public moduleAddress: string;
    public moduleContract: Contract;
    public oracle: OpooSDK

    constructor(moduleAddress: string, oracle: OpooSDK) {
        this.oracle = oracle;
        this.moduleAddress = moduleAddress;
        // TODO: create the module contract instance using the address and ABI
        this.moduleContract = new Contract(moduleAddress, [], this.oracle.signerOrProvider);
    }

    public requestData(requestId: string): string {
        return '';
    }

    public async decodeRequestData<T>(requestId: string): Promise<T> {
        return {} as T;
    }

    public moduleName(): string {
        return '';
    }
}