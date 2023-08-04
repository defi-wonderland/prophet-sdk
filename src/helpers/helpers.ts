import { BigNumberish, BytesLike, ContractRunner, ContractTransaction } from 'ethers';
import { IOracle } from '../types/typechain';
import { IpfsApi } from '../ipfsApi';
import { FullRequestWithMetadata, RequestMetadata } from '../types/types';
import { CONSTANTS } from '../utils/constants';
import { bytes32ToCid } from '../utils/cid';
import { Modules } from '../modules/modules';

export class Helpers {
  private oracle: IOracle;
  private ipfsApi: IpfsApi;
  private modules: Modules;

  public runner: ContractRunner;

  constructor(oracle: IOracle, ipfsApi: IpfsApi, runner: ContractRunner, modules?: Modules) {
    this.oracle = oracle;
    this.ipfsApi = ipfsApi;
    this.runner = runner;
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
   * Creates a new request without uploading the metadata to IPFS
   * @dev This function is useful when the metadata is already uploaded to IPFS and the
   *        IPFS hash is set in the request data
   * @param request - the request to be created
   * @returns the contract transaction
   */
  public createRequestWithoutMetadata(request: IOracle.NewRequestStruct): Promise<ContractTransaction> {
    return this.oracle.createRequest(request);
  }

  /**
   * Creates a new request with the given request data and metadata
   * @dev This function uploads the metadata to IPFS using the RequestMetadata
   *        and sets the IPFS hash in the request data
   * @param request - the request to be created
   * @param requestMetadata - the metadata of the request, such as response type and description
   * @returns the contract transaction
   */
  public async createRequest(
    request: IOracle.NewRequestStruct,
    requestMetadata: RequestMetadata
  ): Promise<ContractTransaction> {
    if (!this.validateResponseType(requestMetadata.responseType))
      throw new Error(`Invalid response type: ${requestMetadata.responseType}`);

    // If the user didn't set the known modules we just skip it, or should we throw an error?
    if (this.modules) {
      requestMetadata['returnedTypes'] = {
        [request.requestModule as string]: await this.modules.getNamedDecodeRequestReturnTypes(
          request.requestModule as string
        ),
        [request.responseModule as string]: await this.modules.getNamedDecodeRequestReturnTypes(
          request.responseModule as string
        ),
        [request.disputeModule as string]: await this.modules.getNamedDecodeRequestReturnTypes(
          request.disputeModule as string
        ),
        [request.resolutionModule as string]: await this.modules.getNamedDecodeRequestReturnTypes(
          request.resolutionModule as string
        ),
        [request.finalityModule as string]: await this.modules.getNamedDecodeRequestReturnTypes(
          request.finalityModule as string
        ),
      };
    }

    const ipfsHash = await this.ipfsApi.uploadMetadata(requestMetadata);
    request.ipfsHash = ipfsHash;
    return this.oracle.createRequest(request);
  }

  /*
  // TODO: Not available because is not implemented yet in the oracle contract, uncomment when it is implemented
  public async createRequests(
    requests: IOracle.NewRequestStruct[],
    requestMetadata: RequestMetadata[]
  ): Promise<ContractTransaction> {
    if (requests.length !== requestMetadata.length)
      throw new Error('Requests data and metadata must be the same length');

    const abiCoder = new ethers.utils.AbiCoder();

    const requestsData: BytesLike[] = [];
    for (let i = 0; i < requests.length; i++) {
      const metadata = requestMetadata[i];
      const request = requests[i];

      if (!this.validateResponseType(metadata.responseType))
        throw new Error(`Invalid response type: ${metadata.responseType}`);

      const ipfsHash = await this.ipfsApi.uploadMetadata(metadata);
      request.ipfsHash = ipfsHash;

      requestsData.push(
        abiCoder.encode(
          [
            'bytes',
            'bytes',
            'bytes',
            'bytes',
            'bytes',
            'bytes32',
            'address',
            'address',
            'address',
            'address',
            'address',
          ],
          [
            request.requestModuleData,
            request.responseModuleData,
            request.disputeModuleData,
            request.resolutionModuleData,
            request.finalityModuleData,
            request.ipfsHash,
            request.requestModule,
            request.responseModule,
            request.disputeModule,
            request.resolutionModule,
            request.finalityModule,
          ]
        )
      );
    }

    return this.oracle.createRequests(requestsData);
  }
  */

  /**
   * Gets the request for the given request id
   * @param requestId - the request id
   * @returns the request for the given requestId
   */
  public getRequest(requestId: BytesLike): Promise<IOracle.RequestStructOutput> {
    return this.oracle.getRequest(requestId);
  }

  /**
   * Proposes a response for the given request id
   * @param requestId - the request id
   * @param responseData - the response data
   * @returns the contract transaction
   */
  public proposeResponse(requestId: BytesLike, responseData: BytesLike): Promise<ContractTransaction> {
    return this.oracle['proposeResponse(bytes32,bytes)'](requestId, responseData);
  }

  /**
   * Gets a response for the given response id
   * @param responseId - the response id
   * @returns the response for the given response id
   **/
  public getResponse(responseId: BytesLike): Promise<IOracle.ResponseStructOutput> {
    return this.oracle.getResponse(responseId);
  }

  /**
   * Gets the ids of the responses for the given request id
   * @param requestId - the request id
   * @returns the ids of the responses for the given request id
   **/
  public getResponseIds(requestId: BytesLike): Promise<string[]> {
    return this.oracle.getResponseIds(requestId);
  }

  /**
   * Gets the finalized response for the given request id
   * @param requestId - the request id
   * @returns the finalized response for the given request id
   **/
  public getFinalizedResponse(requestId: BytesLike): Promise<IOracle.ResponseStructOutput> {
    return this.oracle.getFinalizedResponse(requestId);
  }

  /**
   * Gets the list of full requests for the given startFrom and amount
   * @param startFrom - the start index
   * @param amount - the amount of requests to get
   * @returns the list of full requests for the given startFrom and amount
   **/
  public listRequests(startFrom: BigNumberish, amount: BigNumberish): Promise<IOracle.FullRequestStructOutput[]> {
    return this.oracle.listRequests(startFrom, amount);
  }

  /**
   * Disputes the given request id
   * @param requestId - the request id
   * @returns the contract transaction
   **/
  public disputeResponse(requestId: BytesLike, responseId: BytesLike): Promise<ContractTransaction> {
    return this.oracle.disputeResponse(requestId, responseId);
  }

  /**
   * Returns true or false whether the request is configured to use the given module
   * @param requestId - the request id
   * @param module - the module address
   * @returns true or false depending on if the module is valid
   **/
  public validModule(requestId: BytesLike, module: string): Promise<boolean> {
    return this.oracle.validModule(requestId, module);
  }

  /**
   * Gets the dispute for the given dispute id
   * @param disputeId - the dispute id
   * @returns the dispute for the given dispute id
   **/
  public getDispute(disputeId: BytesLike): Promise<IOracle.DisputeStructOutput> {
    return this.oracle.getDispute(disputeId);
  }

  /**
   * Gets the full request for the given request id
   * @param requestId - the request id
   * @returns the full request for the given request id
   **/
  public getFullRequest(requestId: BytesLike): Promise<IOracle.FullRequestStructOutput> {
    return this.oracle.getFullRequest(requestId);
  }

  /**
   * Gets the dispute id for the given request id
   * @param requestId - the request id
   * @returns the dispute id for the given request id
   **/
  public disputeOf(requestId: BytesLike): Promise<string> {
    return this.oracle.disputeOf(requestId);
  }

  /**
   * Escalates the given dispute
   * @param disputeId - the dispute id
   * @returns the contract transaction
   **/
  public escalateDispute(_disputeId: BytesLike): Promise<ContractTransaction> {
    return this.oracle.escalateDispute(_disputeId);
  }

  /**
   * Resolves the given dispute
   * @param disputeId - the dispute id
   * @returns the contract transaction
   **/
  public resolveDispute(disputeId: BytesLike): Promise<ContractTransaction> {
    return this.oracle.resolveDispute(disputeId);
  }

  /**
   * Gets the list of request ids for the given startFrom and batchSize
   * @param startFrom - the start index
   * @param batchSize - the amount of requests to get
   * @returns the list of request ids for the given startFrom and batchSize
   **/
  public listRequestIds(startFrom: BigNumberish, batchSize: BigNumberish): Promise<string[]> {
    return this.oracle.listRequestIds(startFrom, batchSize);
  }

  /**
   * Finalizes the given request
   * @param requestId - the request id
   * @param finalizedResponseId - the finalized response id
   * @returns the contract transaction
   **/
  public finalize(requestId: BytesLike, finalizedResponseId: BytesLike): Promise<ContractTransaction> {
    return this.oracle.finalize(requestId, finalizedResponseId);
  }

  /**
   * Queries ipfs for the given ipfs hash converting it first to a valid cid
   * @param ipfsHash - the IPFS hash
   * @returns the request metadata
   **/
  public getRequestMetadata(ipfsHash: string): Promise<RequestMetadata> {
    const cid = bytes32ToCid(ipfsHash);
    return this.ipfsApi.getMetadata(cid);
  }

  /**
   * Gets the full request and metadata for the given request id
   * @param requestId - the request id
   * @returns the full request and metadata for the given request id
   **/
  public async getFullRequestWithMetadata(requestId: BytesLike): Promise<FullRequestWithMetadata> {
    const fullRequest = await this.getFullRequest(requestId);
    const metadata = await this.getRequestMetadata(fullRequest.ipfsHash);
    return {
      fullRequest: fullRequest,
      metadata: metadata,
    };
  }

  private validateResponseType(responseType: string): boolean {
    const validResponseTypes: string[] = [
      ...CONSTANTS.SOLIDITY_TYPES,
      ...CONSTANTS.SOLIDITY_TYPES.map((type) => `${type}[]`),
    ];
    return validResponseTypes.includes(responseType);
  }
}
