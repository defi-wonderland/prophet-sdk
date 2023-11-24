import { BytesLike, Fragment, FunctionFragment, ethers } from 'ethers';
import { Module } from '../module';
import { ModulesMap } from '../types/Module';

/**
 * @title Modules
 * @notice A class to manage known modules with useful methods to get data from them
 */
export class Modules {
  public knownModules: ModulesMap;

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
  public async getDecodeRequestReturnTypes(moduleAddress: string): Promise<any[]> {
    return this.getReturnTypes(moduleAddress, false);
  }

  /**
   * Get the named return types from the decode request method of a module
   * @param moduleAddress - The address of the module to get the decode request method named return types for
   * @returns The named return types of the decode request method
   */
  public async getNamedDecodeRequestReturnTypes(moduleAddress: string): Promise<any[]> {
    return this.getReturnTypes(moduleAddress, true);
  }

  /**
   * Decode the request data from a module
   * @dev the module needs to be set in the known modules
   * @param moduleAddress - the address of the module to decode the request data from
   * @param requestData - the request data to decode
   * @returns the decoded request data
   */
  public async decodeRequestData(moduleAddress: string, requestData: BytesLike): Promise<any> {
    const decodeReturnTypes = await this.getDecodeRequestReturnTypes(moduleAddress);
    const decodedRequestData = ethers.AbiCoder.defaultAbiCoder().decode(decodeReturnTypes, requestData);
    return decodedRequestData;
  }

  /**
   * Encode the request data for a module
   * @dev the module needs to be set in the known modules
   * @param moduleAddress - the address of the module to encode the request data for
   * @param requestObject  - the request object to encode
   * @returns the encoded request data
   */
  public async encodeRequestData(moduleAddress: string, requestObject: any): Promise<any> {
    const decodeReturnTypes = await this.getDecodeRequestReturnTypes(moduleAddress);
    const encodedRequestData = ethers.AbiCoder.defaultAbiCoder().encode(decodeReturnTypes, [requestObject]);
    return encodedRequestData;
  }

  private async getReturnTypes(moduleAddress: string, named: boolean): Promise<any[]> {
    const decodeFunction = this.getDecodeRequestFunction(moduleAddress);
    if (!decodeFunction)
      throw new Error(`Module ${moduleAddress} doesn't have a decodeRequestData function, or module was not set`);

    const returnTypes: any[] = [];

    for (const output of decodeFunction['outputs']) {
      named ? this.pushNamedOutput(output, returnTypes) : this.pushOutput(output, returnTypes);
    }

    return returnTypes;
  }

  private getDecodeRequestFunction(moduleAddress: string): Fragment {
    const module = this.getModule(moduleAddress);
    const decodeFunction = module.moduleContract.interface['fragments'].find(
      (f: FunctionFragment) => f.name === 'decodeRequestData' && f.type === 'function'
    );
    if (!decodeFunction) throw new Error(`Module ${moduleAddress} doesn't have a decodeRequestData function`);
    return decodeFunction;
  }

  private pushNamedOutput(output: any, currentNode: any) {
    if (output.type == 'tuple' || output.type == 'tuple[]') {
      const newCurrentNode = {
        name: output.name,
        type: output.type,
        components: [],
      };
      currentNode.components ? currentNode.components.push(newCurrentNode) : currentNode.push(newCurrentNode);
      for (const component of output.components) {
        this.pushNamedOutput(component, newCurrentNode);
      }
    } else {
      const newNode = {
        name: output.name,
        type: output.type,
      };
      currentNode.components ? currentNode.components.push(newNode) : currentNode.push(newNode);
    }
  }

  private pushOutput(output: any, currentNode: any) {
    if (output.type == 'tuple' || output.type == 'tuple[]') {
      const newCurrentNode = {
        type: output.type,
        components: [],
      };
      currentNode.components ? currentNode.components.push(newCurrentNode) : currentNode.push(newCurrentNode);
      for (const component of output.components) {
        this.pushOutput(component, newCurrentNode);
      }
    } else {
      const newNode = {
        type: output.type,
      };
      currentNode.components ? currentNode.components.push(newNode) : currentNode.push(newNode);
    }
  }

  public setKnownModules(knownModules: ModulesMap) {
    this.knownModules = knownModules;
  }
}
