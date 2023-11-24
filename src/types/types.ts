import { BaseContract, BytesLike } from 'ethers';
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

export interface FullResponse {
  requestId: BytesLike;
  responseId: BytesLike;
  response: IOracle.ResponseStruct;
  blockNumber: bigint;
  disputeId: BytesLike;
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

export interface RequestFullData {
  requestWithId: RequestWithId;
  responses: FullResponse[];
  finalizedResponse: FullResponse;
  disputeStatus: number;
  requestModuleName: string;
  responseModuleName: string;
  disputeModuleName: string;
  resolutionModuleName: string;
  finalityModuleName: string;
}

// Batching contracts
export interface DisputeData {
  requestId: BytesLike;
  isFinalized: boolean;
  disputes: {
    disputeId: BytesLike;
    createdAt: number;
    responseId: BytesLike;
    status: number;
  }[];
}
export interface RequestData {
  requestId: BytesLike;
  responses: ResponseData[];
  finalizedResponseId: BytesLike;
  disputeStatus: number;
}

export interface RequestForFinalizeData {
  requestId: BytesLike;
  finalizedAt: number;
  responsesIds: BytesLike[];
}

export interface ResponseData {
  responseId: BytesLike;
  createdAt: number;
  disputeId: BytesLike;
}
