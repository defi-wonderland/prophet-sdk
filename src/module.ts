import { Contract, utils } from 'ethers';
import { OpooSDK } from './oracle';
import { IModuleBase } from './types/Module';

export class Module {
  public moduleAddress: string;
  public moduleContract: IModuleBase;
  public oracle: OpooSDK;

  constructor(moduleAddress: string, abiOrInterface: utils.Interface | any, oracle: OpooSDK) {
    this.oracle = oracle;
    this.moduleAddress = moduleAddress;
    try {
      this.moduleContract = new Contract(moduleAddress, abiOrInterface, this.oracle.signerOrProvider) as IModuleBase;
    } catch (e) {
      throw new Error(`Failed to create module contract instance for ${moduleAddress}: ${e}`);
    }
  }

  public async requestData(requestId: string): Promise<string> {
    let data: string;
    try {
      data = await this.moduleContract.requestData(requestId);
    } catch (e) {
      throw new Error(`Failed to get request data for ${requestId}: ${e}`);
    }
    return data;
  }

  public async decodeRequestData<T>(requestId: string): Promise<T> {
    let data: T;
    try {
      data = await this.moduleContract.decodeRequestData(requestId);
    } catch (e) {
      throw new Error(`Failed to decode request data for ${requestId}: ${e}`);
    }
    return data;
  }

  public async moduleName(): Promise<string> {
    return await this.moduleContract.moduleName();
  }
}
