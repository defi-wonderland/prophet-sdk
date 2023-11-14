import { BaseContract, BytesLike, Contract } from 'ethers';
import { IOracle } from './typechain/IOracle';

// @dev when creating a new request by the user, returnedTypes should be null
export type RequestMetadata = {
  responseType: string;
  description: string;
  returnedTypes: any | null; // will be set by the upload metadata method
};

export type ModuleInstance = {
  baseContract: BaseContract;
  moduleClass: string;
};

export type Address = string | Contract;

export type FullRequestWithMetadata = {
  fullRequest: IOracle.RequestStruct;
  metadata: RequestMetadata;
};

export type RequestWithId = {
  requestId: BytesLike;
  request: IOracle.RequestStruct;
  blockNumber: bigint;
};
