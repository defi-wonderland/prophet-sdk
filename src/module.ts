import { Contract, utils } from 'ethers';
import { Provider } from '@ethersproject/abstract-provider';
import { OpooSDK } from './oracle';
import { IModuleBase } from './types/Module';

export class Module {
  public moduleAddress: string;
  public moduleContract: IModuleBase;
  public oracle: OpooSDK;
  public provider: Provider;

  // TODO: remove provider and use oracle's signer or provider when ready
  constructor(moduleAddress: string, abiOrInterface: utils.Interface | any, provider: Provider) {
    this.provider = provider;
    this.moduleAddress = moduleAddress;
    try {
      this.moduleContract = new Contract(moduleAddress, abiOrInterface, provider) as IModuleBase;
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
