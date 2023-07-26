import { BaseContract, Contract } from 'ethers';
import { IOracle } from './typechain/IOracle';

export type RequestMetadata = {
  responseType: string;
  description: string;
};

export type ModuleInstance = {
  baseContract: BaseContract;
  moduleClass: string;
};

export type Address = string | Contract;

export type FullRequestWithMetadata = {
  fullRequest: IOracle.FullRequestStructOutput;
  metadata: RequestMetadata;
};
