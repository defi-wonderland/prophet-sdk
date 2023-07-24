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
import { ModuleInstance, RequestMetadata } from '../types/types';
import { CONSTANTS } from '../utils/constants';

export class Helpers {
  private oracle: IOracle;
  private ipfsApi: IpfsApi;
  public signerOrProvider: Provider | Signer;

  constructor(oracle: IOracle, ipfsApi: IpfsApi, signerOrProvider: Provider | Signer) {
    this.oracle = oracle;
    this.ipfsApi = ipfsApi;
    this.signerOrProvider = signerOrProvider;
  }

  public createRequestWithoutMetadata(request: IOracle.NewRequestStruct): Promise<ContractTransaction> {
    return this.oracle.createRequest(request);
  }

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

  public getRequest(requestId: BytesLike): Promise<IOracle.RequestStructOutput> {
    return this.oracle.getRequest(requestId);
  }

  public proposeResponse(requestId: BytesLike, responseData: BytesLike): Promise<ContractTransaction> {
    return this.oracle['proposeResponse(bytes32,bytes)'](requestId, responseData);
  }

  public proposeResponseWithProposer(
    proposer: string,
    requestId: BytesLike,
    responseData: BytesLike
  ): Promise<ContractTransaction> {
    return this.oracle['proposeResponse(address,bytes32,bytes)'](proposer, requestId, responseData);
  }

  public getResponse(responseId: BytesLike): Promise<IOracle.ResponseStructOutput> {
    return this.oracle.getResponse(responseId);
  }

  public getResponseIds(requestId: BytesLike): Promise<string[]> {
    return this.oracle.getResponseIds(requestId);
  }

  public getFinalizedResponse(requestId: BytesLike): Promise<IOracle.ResponseStructOutput> {
    return this.oracle.getFinalizedResponse(requestId);
  }

  public listRequests(startFrom: BigNumberish, amount: BigNumberish): Promise<IOracle.FullRequestStructOutput[]> {
    return this.oracle.listRequests(startFrom, amount);
  }

  public disputeResponse(requestId: BytesLike, responseId: BytesLike): Promise<ContractTransaction> {
    return this.oracle.disputeResponse(requestId, responseId);
  }

  public async instantiateModule(moduleAddress: string): Promise<ModuleInstance> {
    const module = new ethers.Contract(moduleAddress, IAbiModule, this.signerOrProvider) as IModule;
    return this.moduleToInterface(module);
  }

  public getModules() {
    // TODO
  }

  public validModule(requestId: BytesLike, module: string): Promise<boolean> {
    return this.oracle.validModule(requestId, module);
  }

  public getDispute(disputeId: BytesLike): Promise<IOracle.DisputeStructOutput> {
    return this.oracle.getDispute(disputeId);
  }

  public getFullRequest(requestId: BytesLike): Promise<IOracle.FullRequestStructOutput> {
    return this.oracle.getFullRequest(requestId);
  }

  public disputeOf(requestId: BytesLike): Promise<string> {
    return this.oracle.disputeOf(requestId);
  }

  public escalateDispute(_disputeId: BytesLike): Promise<ContractTransaction> {
    return this.oracle.escalateDispute(_disputeId);
  }

  public resolveDispute(disputeId: BytesLike): Promise<ContractTransaction> {
    return this.oracle.resolveDispute(disputeId);
  }

  public listRequestIds(startFrom: BigNumberish, batchSize: BigNumberish): Promise<string[]> {
    return this.oracle.listRequestIds(startFrom, batchSize);
  }

  public finalize(requestId: BytesLike, finalizedResponseId: BytesLike): Promise<ContractTransaction> {
    return this.oracle.finalize(requestId, finalizedResponseId);
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
