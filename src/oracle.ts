import { Modules } from './types/index';
import { ethers } from 'ethers';
import { abi as IAbiOracle } from 'opoo-core/abi/IOracle.json';
import { ORACLE } from './utils/index';
import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { IOracle } from './types/typechain';
import { Batching } from './batching';
import { Helpers } from './helpers';
import { IpfsApi } from './ipfsApi';
import { Ipfs } from './ipfs';
import config from './config/config';

export class OpooSDK {
  /**
   * The contract of the Oracle to use
   */
  public oracle: IOracle;

  /**
   * The addresses of the Modules to use
   */
  public whitelistedModules: Modules;

  /**
   * The signer or provider to use
   */
  public signerOrProvider: Provider | Signer;

  public batching: Batching;
  public helpers: Helpers;
  public ipfs: Ipfs;

  /**
   * Constructor
   */
  constructor(signerOrProvider: Provider | Signer, oracleAddress?: string) {
    this.signerOrProvider = signerOrProvider;
    oracleAddress = oracleAddress ? oracleAddress : ORACLE;

    try {
      this.oracle = new ethers.Contract(
        oracleAddress,
        IAbiOracle,
        this.signerOrProvider
      ) as IOracle;

      this.batching = new Batching(this);
      const ipfsApi = new IpfsApi(config.PINATA_API_KEY, config.PINATA_SECRET_API_KEY);
      this.helpers = new Helpers(this, ipfsApi);
      this.ipfs = new Ipfs(this, ipfsApi);
    } catch (e) {
      throw new Error(`Failed to create oracle contract ${e}`);
    }
  }
}
