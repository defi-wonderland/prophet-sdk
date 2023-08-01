import { BaseContract, BigNumberish, BytesLike, ContractTransaction, ethers } from 'ethers';
import {
  IArbitratorModule,
  IBondEscalationModule,
  IBondEscalationResolutionModule,
  IBondedDisputeModule,
  IBondedResponseModule,
  ICallbackModule,
  IContractCallRequestModule,
  IERC20ResolutionModule,
  IHttpRequestModule,
  IModule,
  IOracle,
} from '../types/typechain';
import { IpfsApi } from '../ipfsApi';
import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { abi as IAbiModule } from 'opoo-core/abi/IModule.json';
import { abi as IAbiArbitratorModule } from 'opoo-core/abi/IArbitratorModule.json';
import { abi as IAbiBondEscalationModule } from 'opoo-core/abi/IBondEscalationModule.json';
import { abi as IAbiBondEscalationResolutionModule } from 'opoo-core/abi/IBondEscalationResolutionModule.json';
import { abi as IAbiBondedDisputeModule } from 'opoo-core/abi/IBondedDisputeModule.json';
import { abi as IAbiBondedResponseModule } from 'opoo-core/abi/IBondedResponseModule.json';
import { abi as IAbiCallbackModule } from 'opoo-core/abi/ICallbackModule.json';
import { abi as IAbiContractCallRequestModule } from 'opoo-core/abi/IContractCallRequestModule.json';
import { abi as IAbiERC20ResolutionModule } from 'opoo-core/abi/IERC20ResolutionModule.json';
import { abi as IAbiHttpRequestModule } from 'opoo-core/abi/IHttpRequestModule.json';
import { FullRequestWithMetadata, ModuleInstance, RequestMetadata } from '../types/types';
import { CONSTANTS } from '../utils/constants';
import { bytes32ToCid } from '../utils/cid';

export class Helpers {
  private oracle: IOracle;
  private ipfsApi: IpfsApi;
  public signerOrProvider: Provider | Signer;

  constructor(oracle: IOracle, ipfsApi: IpfsApi, signerOrProvider: Provider | Signer) {
    this.oracle = oracle;
    this.ipfsApi = ipfsApi;
    this.signerOrProvider = signerOrProvider;
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
   * Instantiates a module instance for the given module address
   * @param moduleAddress - the module address
   * @returns the module instance
   **/
  public async instantiateModule(moduleAddress: string): Promise<ModuleInstance> {
    const module = new ethers.Contract(moduleAddress, IAbiModule, this.signerOrProvider) as IModule;
    return this.moduleToInterface(module);
  }

  public getModules() {
    // TODO
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

  private async moduleToInterface(module: IModule): Promise<ModuleInstance> {
    const moduleName = await module.moduleName();
    const moduleAddress = module.address;
    let baseContract: BaseContract;

    switch (moduleName) {
      case 'ArbitratorModule':
        baseContract = new ethers.Contract(
          moduleAddress,
          IAbiArbitratorModule,
          this.signerOrProvider
        ) as IArbitratorModule;
        break;

      case 'BondedDisputeModule':
        baseContract = new ethers.Contract(
          moduleAddress,
          IAbiBondedDisputeModule,
          this.signerOrProvider
        ) as IBondedDisputeModule;
        break;

      case 'BondedResponseModule':
        baseContract = new ethers.Contract(
          moduleAddress,
          IAbiBondedResponseModule,
          this.signerOrProvider
        ) as IBondedResponseModule;
        break;

      case 'BondEscalationModule':
        baseContract = new ethers.Contract(
          moduleAddress,
          IAbiBondEscalationModule,
          this.signerOrProvider
        ) as IBondEscalationModule;
        break;

      case 'BondEscalationResolutionModule':
        baseContract = new ethers.Contract(
          moduleAddress,
          IAbiBondEscalationResolutionModule,
          this.signerOrProvider
        ) as IBondEscalationResolutionModule;
        break;

      case 'CallbackModule':
        baseContract = new ethers.Contract(moduleAddress, IAbiCallbackModule, this.signerOrProvider) as ICallbackModule;
        break;

      case 'ContractCallRequestModule':
        baseContract = new ethers.Contract(
          moduleAddress,
          IAbiContractCallRequestModule,
          this.signerOrProvider
        ) as IContractCallRequestModule;
        break;

      case 'ERC20ResolutionModule':
        baseContract = new ethers.Contract(
          moduleAddress,
          IAbiERC20ResolutionModule,
          this.signerOrProvider
        ) as IERC20ResolutionModule;
        break;

      case 'HttpRequestModule':
        baseContract = new ethers.Contract(
          moduleAddress,
          IAbiHttpRequestModule,
          this.signerOrProvider
        ) as IHttpRequestModule;
        break;

      case 'MultipleCallbacksModule':
        baseContract = new ethers.Contract(moduleAddress, IAbiCallbackModule, this.signerOrProvider) as ICallbackModule;
        break;
    }

    return {
      baseContract: baseContract,
      moduleClass: `I${moduleName}`,
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
