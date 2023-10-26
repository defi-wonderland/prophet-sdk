import { ContractRunner, ethers } from 'ethers';
import { abi as IAbiOracle } from '@defi-wonderland/prophet-core-abi/abi/IOracle.json';
import { IOracle } from './types/typechain';
import { Batching } from './batching';
import { Helpers } from './helpers';
import { IIpfsApi, IpfsApi } from './ipfsApi';
import { Ipfs } from './ipfs';
import config from './config/config';
import { CONSTANTS } from './utils';
import { ModulesMap } from './types/Module';
import { Modules } from './modules/modules';
import { AddressAndAbi } from './types/types';
import { Module } from './module';

export class ProphetSDK {
  /**
   * The contract of the Oracle to use
   */
  public oracle: IOracle;

  /**
   * The runner to use
   */
  public runner: ContractRunner;

  public batching: Batching;
  public helpers: Helpers;
  public ipfs: Ipfs;
  public modules: Modules;

  /**
   * Constructor
   */
  constructor(runner: ContractRunner, oracleAddress?: string, knownModules?: ModulesMap | AddressAndAbi[]) {
    this.runner = runner;
    oracleAddress = oracleAddress ? oracleAddress : CONSTANTS.ORACLE;

    try {
      this.oracle = new ethers.Contract(oracleAddress, IAbiOracle, this.runner) as unknown as IOracle;

      this.batching = new Batching(this.oracle);
      const ipfsApi = new IpfsApi(config.PINATA_API_KEY, config.PINATA_SECRET_API_KEY);
      this.helpers = new Helpers(this.oracle, ipfsApi);
      this.ipfs = new Ipfs(ipfsApi);
      this.setKnownModules(knownModules);
    } catch (e) {
      throw new Error(`Failed to create oracle contract ${e}`);
    }
  }

  /**
   * Set the known modules
   * @param knownModules - A list of custom modules that can be added to the oracle
   */
  public setKnownModules(knownModules: ModulesMap | AddressAndAbi[]) {
    if (!this.modules) this.modules = new Modules({});
    if (!knownModules) return;
    if (Array.isArray(knownModules)) {
      const modulesMap: ModulesMap = {};
      for (const module of knownModules) {
        modulesMap[module.address] = new Module(module.address, module.abi, this.runner);
      }
      this.modules.setKnownModules(modulesMap);
    } else {
      this.modules.setKnownModules(knownModules);
    }

    this.helpers.setModules(this.modules);
  }

  /**
   * Set a custom ipfs api, Pinata will be used by default
   * @param ipfsApi - The ipfs api to use
   */
  public setIpfsApi(ipfsApi: IIpfsApi) {
    this.ipfs.setIpfsApi(ipfsApi);
  }
}
