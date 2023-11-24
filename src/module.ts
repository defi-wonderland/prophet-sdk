import { ethers, Contract, ContractRunner, BytesLike } from 'ethers';
import { IModuleBase } from './types/Module';

/**
 * @title Module
 * @notice Wrapper for module contract
 */
export class Module {
  public moduleAddress: string;
  public moduleContract: IModuleBase;

  constructor(moduleAddress: string, abiOrInterface: ethers.Interface | any, runner: ContractRunner) {
    this.moduleAddress = moduleAddress;
    try {
      this.moduleContract = new Contract(moduleAddress, abiOrInterface, runner) as unknown as IModuleBase;
    } catch (e) {
      throw new Error(`Failed to create module contract instance for ${moduleAddress}: ${e}`);
    }
  }

  /**
   * Returns decoded the data for a request
   * @param requestData - The request data bytes
   * @returns the decoded data for the request
   **/
  public async decodeRequestData<T>(requestData: BytesLike): Promise<T> {
    let data: T;
    try {
      data = await this.moduleContract.decodeRequestData(requestData);
    } catch (e) {
      throw new Error(`Failed to decode request data for ${requestData}: ${e}`);
    }
    return data;
  }

  /**
   * Returns a module's name
   * @returns the module's name
   **/
  public async moduleName(): Promise<string> {
    return await this.moduleContract.moduleName();
  }
}
