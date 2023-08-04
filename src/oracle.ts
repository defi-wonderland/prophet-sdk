import { ModulesMap } from './types/index';
import { ethers } from 'ethers';
import { abi as IAbiOracle } from 'opoo-core/abi/IOracle.json';
import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { IOracle } from './types/typechain';
import { Batching } from './batching';
import { Helpers } from './helpers';
import { IpfsApi } from './ipfsApi';
import { Ipfs } from './ipfs';
import config from './config/config';
import { CONSTANTS } from './utils';
import { Modules } from './modules/modules';

export class OpooSDK {
  /**
   * The contract of the Oracle to use
   */
  public oracle: IOracle;

  /**
   * The signer or provider to use
   */
  public signerOrProvider: Provider | Signer;

  public batching: Batching;
  public helpers: Helpers;
  public ipfs: Ipfs;
  public modules: Modules;

  /**
   * Constructor
   */
  constructor(signerOrProvider: Provider | Signer, oracleAddress?: string, knownModules?: ModulesMap) {
    this.signerOrProvider = signerOrProvider;
    oracleAddress = oracleAddress ? oracleAddress : CONSTANTS.ORACLE;

    try {
      this.oracle = new ethers.Contract(oracleAddress, IAbiOracle, this.signerOrProvider) as IOracle;

      this.batching = new Batching(this.oracle);
      const ipfsApi = new IpfsApi(config.PINATA_API_KEY, config.PINATA_SECRET_API_KEY);
      this.modules = new Modules(knownModules);
      this.helpers = new Helpers(this.oracle, ipfsApi, signerOrProvider, this.modules);
      this.ipfs = new Ipfs(this.oracle, ipfsApi);
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
}
