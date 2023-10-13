import { ContractRunner, ethers } from 'ethers';
import { abi as IAbiOracle } from '@defi-wonderland/prophet-core-contracts/abi/IOracle.json';
import { IOracle } from './types/typechain';
import { Batching } from './batching';
import { Helpers } from './helpers';
import { IIpfsApi, IpfsApi } from './ipfsApi';
import { Ipfs } from './ipfs';
import config from './config/config';
import { CONSTANTS } from './utils';
import { ModulesMap } from './types/Module';
import { Modules } from './modules/modules';

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
  constructor(runner: ContractRunner, oracleAddress?: string, knownModules?: ModulesMap) {
    this.runner = runner;
    oracleAddress = oracleAddress ? oracleAddress : CONSTANTS.ORACLE;

    try {
      this.oracle = new ethers.Contract(oracleAddress, IAbiOracle, this.runner) as unknown as IOracle;

      this.batching = new Batching(this.oracle);
      const ipfsApi = new IpfsApi(config.PINATA_API_KEY, config.PINATA_SECRET_API_KEY);
      this.modules = new Modules(knownModules);
      this.helpers = new Helpers(this.oracle, ipfsApi, this.modules);
      this.ipfs = new Ipfs(ipfsApi);
      this.modules = new Modules(knownModules);
    } catch (e) {
      throw new Error(`Failed to create oracle contract ${e}`);
    }
  }

  /**
   * Set the known modules
   * @param knownModules - A list of custom modules that can be added to the oracle
   */
  public setKnownModules(knownModules: ModulesMap) {
    this.modules.setKnownModules(knownModules);
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
