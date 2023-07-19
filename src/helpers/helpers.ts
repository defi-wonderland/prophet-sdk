import { BaseContract, BigNumberish, BytesLike, ContractTransaction, ethers } from 'ethers';
import { IArbitratorModule, IBondEscalationModule, IBondEscalationResolutionModule, IBondedDisputeModule, IBondedResponseModule, ICallbackModule, IContractCallRequestModule, IERC20ResolutionModule, IHttpRequestModule, IModule, IOracle } from '../types/typechain';
import { RequestMetadata } from '../types/typeoffchain/typeoffchain';
import { IpfsApi } from '../ipfsApi';
import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { abi as IAbiModule } from 'opoo-core/abi/IModule.json';
import { abi as IAbiArbitratorModule} from 'opoo-core/abi/IArbitratorModule.json';
import { abi as IAbiBondEscalationModule } from 'opoo-core/abi/IBondEscalationModule.json';
import { abi as IAbiBondEscalationResolutionModule } from 'opoo-core/abi/IBondEscalationResolutionModule.json';
import { abi as IAbiBondedDisputeModule } from 'opoo-core/abi/IBondedDisputeModule.json';
import { abi as IAbiBondedResponseModule } from 'opoo-core/abi/IBondedResponseModule.json';
import { abi as IAbiCallbackModule } from 'opoo-core/abi/ICallbackModule.json';
import { abi as IAbiContractCallRequestModule } from 'opoo-core/abi/IContractCallRequestModule.json';
import { abi as IAbiERC20ResolutionModule } from 'opoo-core/abi/IERC20ResolutionModule.json';
import { abi as IAbiHttpRequestModule } from 'opoo-core/abi/IHttpRequestModule.json';
import { solidityTypes } from '../types/typeoffchain/solidityTypes';


export type ModuleInstance = {
    baseContract: BaseContract,
    moduleClass: string
}

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
        requestMetadata: RequestMetadata): Promise<ContractTransaction> {
        if (!this.validateResponseType(requestMetadata.responseType)) throw new Error(`Invalid response type: ${requestMetadata.responseType}`);
        const ipfsHash = await this.ipfsApi.uploadMetadata(requestMetadata);
        request.ipfsHash = ipfsHash;
        return this.oracle.createRequest(request);
    }

    public getRequest(requestId: BytesLike): Promise<IOracle.RequestStructOutput> {
        return this.oracle.getRequest(requestId);
    }

    public proposeResponse(requestId: BytesLike,
        responseData: BytesLike): Promise<ContractTransaction> {
        return this.oracle['proposeResponse(bytes32,bytes)'](requestId, responseData);
    }

    public proposeResponseWithProposer(proposer: string, requestId: BytesLike,
        responseData: BytesLike): Promise<ContractTransaction> {
        return this.oracle['proposeResponse(address,bytes32,bytes)'](proposer,requestId,responseData);
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

    public listRequests(
        startFrom: BigNumberish, 
        amount: BigNumberish): Promise<IOracle.FullRequestStructOutput[]>{
        return this.oracle.listRequests(startFrom, amount);
    }

    public disputeResponse(
        requestId: BytesLike,
        responseId: BytesLike): Promise<ContractTransaction> {
        return this.oracle.disputeResponse(requestId, responseId);
    }

    public async instantiateModule(moduleAddress: string): Promise<ModuleInstance> {
        const module = new ethers.Contract(moduleAddress, IAbiModule, this.signerOrProvider) as IModule;
        return this.moduleToInterface(module);
    }
    

    public getModules() {
        // TODO 
    }

    private async moduleToInterface(module: IModule): Promise<ModuleInstance> {
        const moduleName = await module.moduleName();
        const moduleAddress = module.address;
        let baseContract: BaseContract;
        
        switch (moduleName) {
            case 'ArbitratorModule': 
                baseContract = new ethers.Contract(moduleAddress, IAbiArbitratorModule, this.signerOrProvider) as IArbitratorModule;
                break;
            
            case 'BondedDisputeModule': 
                baseContract = new ethers.Contract(moduleAddress, IAbiBondedDisputeModule, this.signerOrProvider) as IBondedDisputeModule;
                break;
            
            case 'BondedResponseModule': 
                baseContract = new ethers.Contract(moduleAddress, IAbiBondedResponseModule, this.signerOrProvider) as IBondedResponseModule;
                break;
            
            case 'BondEscalationModule': 
                baseContract = new ethers.Contract(moduleAddress, IAbiBondEscalationModule, this.signerOrProvider) as IBondEscalationModule;
                break;
            
            case 'BondEscalationResolutionModule': 
                baseContract = new ethers.Contract(moduleAddress, IAbiBondEscalationResolutionModule, this.signerOrProvider) as IBondEscalationResolutionModule;
                break;
            
            case 'CallbackModule': 
                baseContract = new ethers.Contract(moduleAddress, IAbiCallbackModule, this.signerOrProvider) as ICallbackModule;
                break;
            
            case 'ContractCallRequestModule': 
                baseContract = new ethers.Contract(moduleAddress, IAbiContractCallRequestModule, this.signerOrProvider) as IContractCallRequestModule;
                break;
            

            case 'ERC20ResolutionModule': 
                baseContract = new ethers.Contract(moduleAddress, IAbiERC20ResolutionModule, this.signerOrProvider) as IERC20ResolutionModule;
                break;
            
            case 'HttpRequestModule': 
                baseContract = new ethers.Contract(moduleAddress, IAbiHttpRequestModule, this.signerOrProvider) as IHttpRequestModule;
                break;
            
            case 'MultipleCallbacksModule': 
                baseContract = new ethers.Contract(moduleAddress, IAbiCallbackModule, this.signerOrProvider) as ICallbackModule;
                break;
        }

        return {
            baseContract: baseContract,
            moduleClass: `I${moduleName}`
        }
    }

    private validateResponseType(responseType: string): boolean {
        const validResponseTypes: string[] = [
            ...solidityTypes,
            ...solidityTypes.map((type) => `${type}[]`)
        ];
        return validResponseTypes.includes(responseType);
    }
}

