import { Address, Modules, DisputeStatus } from './types/index';
import { ethers } from 'ethers';
import { abi as IAbiOracle } from 'opoo-core/abi/IOracle.json';
import { ORACLE } from './utils/index';
import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { IOracle } from './types/typechain';

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
    } catch (e) {
      throw new Error(`Failed to create oracle contract ${e}`);
    }
  }

  // --------- CUSTOM FUNCS --------- //
  /**
   * Adds a module to the list of whitelisted modules
   * @param module The address of the module to add
   */
  public addModule(module: Modules): void {
    return;
  }

  /**
   * Removes a module from the list of whitelisted modules
   * @param module The address of the module to remove
   */
  public removeModule(module: Modules): void {
    return;
  }
}
