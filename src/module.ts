import { ethers, Contract, ContractRunner } from 'ethers';
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
   * @param requestId - The request id to get the data for
   * @returns the decoded data for the request
   **/
  // TODO: delete this method ?
  public async decodeRequestData<T>(requestId: string): Promise<T> {
    let data: T;
    try {
      data = await this.moduleContract.decodeRequestData(requestId);
    } catch (e) {
      throw new Error(`Failed to decode request data for ${requestId}: ${e}`);
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
