import { AddressLike, BigNumberish, BytesLike, ContractTransaction } from 'ethers';
import { IOracle } from '../types/typechain';
import { IpfsApi } from '../ipfsApi';
import {
  Address,
  DisputeWithId,
  RequestMetadata,
  RequestWithId,
  RequestWithMetadata,
  ResponseWithId,
} from '../types/types';
import { CONSTANTS } from '../utils/constants';
import { bytes32ToCid } from '../utils/cid';
import { Modules } from '../modules/modules';

export class Helpers {
  private oracle: IOracle;
  private ipfsApi: IpfsApi;
  private modules: Modules;

  constructor(oracle: IOracle, ipfsApi: IpfsApi, modules: Modules) {
    this.oracle = oracle;
    this.ipfsApi = ipfsApi;
    this.modules = modules;
  }

  /**
   * Set the modules helper
   * @param modules - The modules helper
   */
  public setModules(modules: Modules) {
    this.modules = modules;
  }

  /**
   * Creates a new request with the given request data and metadata
   * @dev This function uploads the metadata to IPFS using the RequestMetadata
   *        and sets the IPFS hash in the request data
   * @param request - the request to be created
   * @param requestMetadata - the metadata of the request, such as response type and description
   * @returns the contract transaction response
   */
  public async createRequest(
    request: IOracle.RequestStruct,
    requestMetadata?: RequestMetadata,
    ipfsHash?: BytesLike
  ): Promise<ContractTransaction> {
    if (!requestMetadata && !ipfsHash) throw new Error('Request metadata or ipfs hash must be provided');

    if (!this.validateResponseType(requestMetadata.responseType))
      throw new Error(`Invalid response type: ${requestMetadata.responseType}`);

    this.decodedReturnTypesForModuleExists(request);
    if (!ipfsHash) ipfsHash = await this.uploadMetadata(requestMetadata);

    // TODO: use ipfs hash for request creation
    return this.oracle.createRequest(request);
  }

  /**
   * Create multiple requests with the given request data and metadata
   * @param requests - the requests to be created
   * @param requestMetadata - the metadata of the requests, such as response type and description
   * @returns the contract transaction response
   */
  public async createRequests(
    requests: IOracle.RequestStruct[],
    requestMetadata: RequestMetadata[]
  ): Promise<ContractTransaction> {
    if (requests.length !== requestMetadata.length)
      throw new Error('Requests data and metadata must be the same length');

    const ipfsHashes: BytesLike[] = new Array<BytesLike>(requests.length);

    const uploadPromises = requests.map(async (request, i) => {
      const metadata = requestMetadata[i];

      if (!this.validateResponseType(metadata.responseType))
        throw new Error(`Invalid response type: ${metadata.responseType}`);

      this.decodedReturnTypesForModuleExists(request);
      ipfsHashes[i] = await this.uploadMetadata(metadata);
    });

    await Promise.all(uploadPromises);

    // TODO: add ipfs hashes to the parameters
    return this.oracle.createRequests(requests);
  }

  /**
   * Proposes a response for the given request
   * @param request - the request struct
   * @param responseData - the response struct
   * @returns the contract transaction response
   */
  public proposeResponse(
    request: IOracle.RequestStruct,
    response: IOracle.ResponseStruct
  ): Promise<ContractTransaction> {
    return this.oracle.proposeResponse(request, response);
  }

  /**
   * Gets a response for the given response id
   * @param responseId - the response id
   * @param blockNumber - the block number to get the response from (optional)
   * @returns the response for the given response id
   **/
  public async getResponse(responseId: BytesLike, blockNumber?: number): Promise<ResponseWithId> {
    if (!blockNumber) blockNumber = Number(await this.oracle.createdAt(responseId));
    const result = (await this.oracle.queryFilter(this.oracle.filters.ResponseProposed, blockNumber, blockNumber + 1))
      .map((event) => this.mapEventArgsToResponseWithId(event.args))
      .find((response) => response.responseId === responseId);
    if (!result) throw new Error(`Response with id ${responseId} not found`);
    return result;
  }

  /**
   * Gets a dispute for the given dispute id
   * @param disputeId - the dispute id
   * @param blockNumber - the block number to get the dispute from (optional)
   * @returns the dispute for the given dispute id
   */
  public async getDispute(disputeId: BytesLike, blockNumber?: number): Promise<DisputeWithId> {
    if (!blockNumber) blockNumber = Number(await this.oracle.createdAt(disputeId));
    const result = (await this.oracle.queryFilter(this.oracle.filters.ResponseDisputed, blockNumber, blockNumber + 1))
      .map((event) => this.mapEventArgsToDisputeWithId(event.args))
      .find((dispute) => dispute.disputeId === disputeId);
    if (!result) throw new Error(`Dispute with id ${disputeId} not found`);
    return result;
  }

  /**
   * Gets the ids of the responses for the given request id
   * @param requestId - the request id
   * @returns the ids of the responses for the given request id
   **/
  public getResponseIds(requestId: BytesLike): Promise<BytesLike[]> {
    return this.oracle.getResponseIds(requestId);
  }

  /**
   * Gets the finalized response id for the given request id
   * @param requestId - the request id
   * @returns the finalized response id for the given request id
   **/
  public getFinalizedResponseId(requestId: BytesLike): Promise<BytesLike> {
    return this.oracle.getFinalizedResponseId(requestId);
  }

  /**
   * Gets the list of requests in the given startBlock and endBlock range
   * @param startBlock - the start block to list requests from
   * @param endBlock - the end block to list requests to
   * @returns the list of requests in the range
   **/
  public async listRequests(startBlock: number, endBlock: number): Promise<RequestWithId[]> {
    return (await this.oracle.queryFilter(this.oracle.filters.RequestCreated, startBlock, endBlock)).map(
      (event) => event.args as unknown as RequestWithId
    );
  }

  /**
   * Disputes the given response
   * @param request - the request struct
   * @param response - the response struct
   * @param dispute - the dispute struct
   * @returns the contract transaction response
   **/
  public disputeResponse(
    request: IOracle.RequestStruct,
    response: IOracle.ResponseStruct,
    dispute: IOracle.DisputeStruct
  ): Promise<ContractTransaction> {
    return this.oracle.disputeResponse(request, response, dispute);
  }

  /**
   * Returns true or false whether the request is configured to use the given module
   * @param requestId - the request id
   * @param module - the module address
   * @returns true or false depending on if the module is valid
   **/
  public allowedModule(requestId: BytesLike, module: AddressLike): Promise<boolean> {
    return this.oracle.allowedModule(requestId, module);
  }

  /**
   * Returns the dispute status for a given dispute
   * @param disputeId - the dispute id
   * @returns the dispute status
   */
  public disputeStatus(disputeId: BytesLike): Promise<bigint> {
    return this.oracle.disputeStatus(disputeId);
  }

  /**
   * Gets the block number at which the given request was finalized
   * @param requestId
   * @returns the block number at which the given request was finalized
   */
  public finalizedAt(requestId: BytesLike): Promise<BigNumberish> {
    return this.oracle.finalizedAt(requestId);
  }

  /**
   * Gets the dispute id for the given response id
   * @param responseId - the response id
   * @returns the dispute id for the given response id
   **/
  public disputeOf(responseId: BytesLike): Promise<BytesLike> {
    return this.oracle.disputeOf(responseId);
  }

  /**
   * Gets the block number for the given request id
   * @param requestId - the request id
   * @returns the block number given request id
   */
  public createdAt(requestId: BytesLike): Promise<BigNumberish> {
    return this.oracle.createdAt(requestId);
  }

  /**
   * Escalates the given dispute
   * @param request - the request struct
   * @param response - the response struct
   * @param dispute - the dispute struct
   * @returns the contract transaction response
   **/
  public escalateDispute(
    request: IOracle.RequestStruct,
    response: IOracle.ResponseStruct,
    dispute: IOracle.DisputeStruct
  ): Promise<ContractTransaction> {
    return this.oracle.escalateDispute(request, response, dispute);
  }

  /**
   * Resolves the given dispute
   * @param request - the request struct
   * @param response - the response struct
   * @param dispute - the dispute struct
   * @returns the contract transaction response
   **/
  public resolveDispute(
    request: IOracle.RequestStruct,
    response: IOracle.ResponseStruct,
    dispute: IOracle.DisputeStruct
  ): Promise<ContractTransaction> {
    return this.oracle.resolveDispute(request, response, dispute);
  }

  /**
   * Updates the dispute status for the given dispute
   * @param request - the request struct
   * @param response - the response struct
   * @param dispute  - the dispute struct
   * @param status  - the dispute status
   * @returns the contract transaction response
   */
  public updateDisputeStatus(
    request: IOracle.RequestStruct,
    response: IOracle.ResponseStruct,
    dispute: IOracle.DisputeStruct,
    status: number
  ): Promise<ContractTransaction> {
    return this.oracle.updateDisputeStatus(request, response, dispute, status);
  }

  /**
   * Gets the list of request ids for the given startFrom and batchSize
   * @param startFrom - the start index
   * @param batchSize - the amount of requests to get
   * @returns the list of request ids for the given startFrom and batchSize
   **/
  public listRequestIds(startFrom: BigNumberish, batchSize: BigNumberish): Promise<BytesLike[]> {
    return this.oracle.listRequestIds(startFrom, batchSize);
  }

  /**
   * Finalizes the given request without a response id
   * @param request - the request struct
   * @param response - the response struct
   * @returns the contract transaction response
   */
  public async finalize(
    request: IOracle.RequestStruct,
    response: IOracle.ResponseStruct
  ): Promise<ContractTransaction> {
    return this.oracle.finalize(request, response);
  }

  /**
   * Queries ipfs for the given ipfs hash converting it first to a valid cid
   * @param ipfsHash - the IPFS hash
   * @returns the request metadata
   **/
  public getRequestMetadata(ipfsHash: BytesLike): Promise<RequestMetadata> {
    const cid = bytes32ToCid(ipfsHash);
    return this.ipfsApi.getMetadata(cid);
  }

  /**
   * Gets the request for the given request id
   * @param requestId  - the request id
   * @param blockNumber - the block number to get the request from (optional)
   * @returns the request for the given request id
   */
  public async getRequest(requestId: BytesLike, blockNumber?: number): Promise<RequestWithId> {
    if (!blockNumber) blockNumber = Number(await this.oracle.createdAt(requestId));
    const result = (await this.oracle.queryFilter(this.oracle.filters.RequestCreated, blockNumber, blockNumber + 1))
      .map((event) => this.mapEventArgsToRequestWithId(event.args))
      .find((request) => request.requestId === requestId);
    if (!result) throw new Error(`Request with id ${requestId} not found`);
    return result;
  }

  public async getRequestWithMetadata(requestId: BytesLike): Promise<RequestWithMetadata> {
    const request = await this.getRequest(requestId);
    const metadata = await this.getRequestMetadata(request.ipfsHash);
    return {
      request,
      metadata,
    };
  }

  /**
   * Returns the total request count of the Oracle
   * @returns the total request count of the Oracle
   */
  public totalRequestCount(): Promise<BigNumberish> {
    return this.oracle.totalRequestCount();
  }

  /**
   * Returns the request id for the given nonce
   * @param nonce - the nonce
   * @returns the request id for the given nonce
   */
  public async getRequestId(nonce: BigNumberish): Promise<BytesLike> {
    return this.oracle.getRequestId(nonce);
  }

  /**
   * Returns true or false whether the given user is a participant in the given request
   * @param requestId - the request id
   * @param user - the user address
   * @returns boolean if the user is a participant in the given request
   */
  public async isParticipant(requestId: BytesLike, user: Address): Promise<boolean> {
    return this.oracle.isParticipant(requestId, user);
  }

  /**
   * Performs a static call to the Oracle contract
   * @param method the method to call
   * @param parameters the parameters to pass to the method
   * @returns the result of the static call
   */
  public async callStatic(method: string, ...parameters: any): Promise<any> {
    return this.oracle[method].staticCall(...parameters);
  }

  private validateResponseType(responseType: string): boolean {
    const validResponseTypes: string[] = [
      ...CONSTANTS.SOLIDITY_TYPES,
      ...CONSTANTS.SOLIDITY_TYPES.map((type) => `${type}[]`),
    ];
    return validResponseTypes.includes(responseType);
  }

  private async uploadMetadata(requestMetadata: RequestMetadata): Promise<BytesLike> {
    // If the user didn't set the known modules we throw an error
    requestMetadata.returnedTypes = {};
    if (!this.modules?.knownModules) throw new Error('Known modules not set');
    // Iterate over the known modules and get the return types of the decode request method
    for (const moduleAddress of Object.keys(this.modules.knownModules)) {
      const returnedTypes = await this.modules.getNamedDecodeRequestReturnTypes(moduleAddress);

      if (returnedTypes) {
        requestMetadata.returnedTypes[moduleAddress] = returnedTypes;
      }
    }

    const ipfsHash = await this.ipfsApi.uploadMetadata(requestMetadata);

    return ipfsHash;
  }

  private decodedReturnTypesForModuleExists(request: IOracle.RequestStruct) {
    if (!this.modules?.knownModules) throw new Error('Known modules not set');
    const knownModules = this.modules.knownModules;
    // Address that we need to get the named decoded return types for
    const requestModules = [
      { name: 'requestModule', address: request.requestModule },
      { name: 'responseModule', address: request.responseModule },
      { name: 'disputeModule', address: request.disputeModule },
      { name: 'resolutionModule', address: request.resolutionModule },
      { name: 'finalityModule', address: request.finalityModule },
    ];

    requestModules.forEach((requestModule) => {
      if (
        !(requestModule.address == '0x0000000000000000000000000000000000000000' || !requestModule.address) &&
        !Object.keys(knownModules).includes(requestModule.address as string)
      )
        throw new Error(`${requestModule.name}: ${requestModule.address} is not a known module`);
    });
  }

  private mapEventArgsToRequestWithId(event: any[]): RequestWithId {
    return {
      requestId: event[0],
      request: event[1],
      blockNumber: event[2],
      ipfsHash: event[3], // TODO: check where should ipfsHash should be located
    };
  }

  private mapEventArgsToResponseWithId(event: any[]): ResponseWithId {
    return {
      requestId: event[0],
      response: event[1],
      responseId: event[2],
      blockNumber: event[3],
    };
  }

  private mapEventArgsToDisputeWithId(event: any[]): DisputeWithId {
    return {
      responseId: event[0],
      disputeId: event[1],
      dispute: event[2],
      blockNumber: event[3],
    };
  }
}

export const getDecodeRequestDataFunctionReturnTypes = (abi: any[]) => {
  const decodeRequestDataFunction = abi.find((item) => item.name === 'decodeRequestData').outputs;
  return decodeRequestDataFunction;
};
