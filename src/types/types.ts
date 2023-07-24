import { BaseContract, Contract } from 'ethers';

export type RequestMetadata = {
  responseType: string;
  description: string;
};

export type ModuleInstance = {
  baseContract: BaseContract;
  moduleClass: string;
};

export type Address = string | Contract;
