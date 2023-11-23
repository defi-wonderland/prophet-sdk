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

export interface RequestWithId {
  requestId: BytesLike;
  request: IOracle.RequestStruct;
  ipfsHash: BytesLike;
  blockNumber: bigint;
}

export interface ResponseWithId {
  requestId: BytesLike;
  responseId: BytesLike;
  response: IOracle.ResponseStruct;
  blockNumber: bigint;
}

export interface DisputeWithId {
  responseId: BytesLike;
  disputeId: BytesLike;
  dispute: IOracle.DisputeStruct;
  blockNumber: bigint;
}

export interface RequestWithMetadata {
  request: RequestWithId;
  metadata: RequestMetadata;
}
