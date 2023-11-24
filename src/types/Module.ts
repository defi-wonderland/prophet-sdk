import { BytesLike } from 'ethers';
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
   * Returns the decoded request for the given data, this can return multiple vars compared to requestData
   * @param requestData - The request data Bytes
   */
  decodeRequestData<T>(requestData: BytesLike): Promise<T>;
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
