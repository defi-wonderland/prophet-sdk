import { Module } from '../module';
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
   * Returns the decoded data for the given requestId, this can return multiple vars compared to requestData
   * @param requestId - The requestId to get the data for
   */
  decodeRequestData<T>(requestId: string): Promise<T>;
}

/**
 * A list of custom modules that can be added to the oracle
 */
export interface ModulesMap {
  [address: string]: Module;
}

export enum DisputeStatus {
  None,
  Active,
  Won,
  Lost,
}
