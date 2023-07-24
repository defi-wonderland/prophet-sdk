import { OpooSDK } from '../oracle';
import { IModule } from '../types/typechain/IModule';

/**
 * Module interface
 */
export interface IModuleBase extends IModule {
  /**
   * The address of the module
   */
  moduleAddress: string;

  /**
   * The contract instance of the module
   */
  moduleContract: IModule;

  /**
   * Oracle SDK instance
   */
  oracle: OpooSDK;

  /**
   * Returns the decoded data for the given requestId, this can return multiple vars compared to requestData
   * @param requestId The requestId to get the data for
   */
  decodeRequestData<T>(requestId: string): Promise<T>;
}

/**
 * A list of custom modules that can be added to the oracle
 */
export interface Modules {
  [name: string]: IModuleBase;
}

export enum DisputeStatus {
  None,
  Active,
  Won,
  Lost,
}
