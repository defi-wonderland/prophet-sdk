import { Module } from '../module';
import { ModulesMap } from '../types/Module';

/**
 * @title Modules
 * @notice A class to manage known modules with useful methods to get data from them
 */
export class Modules {
  private knownModules: ModulesMap;

  constructor(knownModules: ModulesMap) {
    this.knownModules = knownModules;
  }

  /**
   * Gets a module instance from the known modules
   * @param address - The address of the module to get
   * @returns The module instance
   */
  public getModule(address: string): Module {
    const module = this.knownModules[address];
    if (!module) throw new Error(`Module ${address} not found`);
    return this.knownModules[address];
  }

  /**
   * Get the return types from the decode request method of a module
   * @param moduleAddress - The address of the module to get the decode request method return types for
   * @returns The return types of the decode request method
   */
  public getDecodeRequestReturnTypes(moduleAddress: string): string {
    const module = this.getModule(moduleAddress);
    const types = module.moduleContract.interface.functions['decodeRequestData(bytes32)'].outputs
      .map((output) => output.type)
      .join(',');
    return `(${types})`;
  }
}
