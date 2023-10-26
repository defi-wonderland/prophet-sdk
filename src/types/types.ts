import { AddressLike, BaseContract, Contract } from 'ethers';
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
  fullRequest: IOracle.FullRequestStruct;
  metadata: RequestMetadata;
};

/**
 * Changed the keys to differentiate between the NewRequestStrunct and RequestData, which is not encoded
 */
export type RequestData = {
  requestObject: any;
  responseObject: any;
  disputeObject: any;
  resolutionObject: any;
  finalityObject: any;
  requestModuleAddress: AddressLike;
  responseModuleAddress: AddressLike;
  disputeModuleAddress: AddressLike;
  resolutionModuleAddress: AddressLike;
  finalityModuleAddress: AddressLike;
  ipfsHash?: string;
};

export type AddressAndAbi = {
  address: string;
  abi: any[];
};
