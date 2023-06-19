import { Contract } from 'ethers';
import { OpooSDK } from '../oracle';

export type Address = string | Contract

/**
 * Module interface
 */
export interface IModule {
    /**
     * The address of the module
     */
    moduleAddress: string;

    /**
     * The contract instance of the module
     */
    moduleContract: Contract;

    /**
     * Oracle SDK instance
     */
    oracle: OpooSDK;

    /**
     * Returns the data for the given requestId, the result is bytes represented as a string
     * @param requestId The requestId to get the data for
     */
    requestData(requestId: string): Promise<string>;

    /**
     * Returns the decoded data for the given requestId, this can return multiple vars compared to requestData
     * @param requestId The requestId to get the data for
     */
    decodeRequestData<T>(requestId: string): Promise<T>;

    /**
     * Returns the name of the module
     */
    moduleName(): Promise<string>;
}

/**
 * A list of custom modules that can be added to the oracle
 */
export interface Modules {
    [name: string]: IModule;
}

export interface Request<T> {
    requestModuleData: T;
    responseModuleData: T;
    disputeModuleData: T;
    resolutionModuleData: T;
    finalityModuleData: T;
    ipfsHash: string;
    requestModule: Address;
    responseModule: Address;
    disputeModule: Address;
    resolutionModule: Address;
    finalityModule: Address;
    requester: Address;
    nonce: number;
    createdAt: number;
}

export interface Response {
    createdAt: number;
    proposer: Address;
    requestId: string;
    disputeId: string;
    response: any; // TODO: define response type
}

export enum DisputeStatus {
    None,
    Active,
    Won,
    Lost
}

export interface Dispute {
    createdAt: number;
    disputer: Address;
    proposer: Address;
    responseId: string;
    requestId: string;
    status: DisputeStatus;
}
