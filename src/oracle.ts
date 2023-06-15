import { Address, Request, Dispute, Response, DisputeStatus, Modules, IModule } from './types/Module';
import { Module } from './module';
import { Signer } from '@ethersproject/abstract-signer';
import { Provider } from '@ethersproject/abstract-provider';

export class OpooSDK {
    /**
     * The addresses of the Modules to use
     */
    public whitelistedModules: Modules;

    /**
     * The signer or provider to use
     */
    public signerOrProvider: Signer | Provider;

    // TODO: add constructor
    constructor() {return;}
    
    // --------- CONTRACT WRAPPED FUNCS --------- //
    /**
     * Creates a new request, calls the Oracle's createRequest function
     * @param request The request to create
     * @returns The ID of the created request
     */
    public async createRequest(request: Request<any>): Promise<string> {
        return '';
    }

    public validModule(requestId: string, module: Address): boolean {
        return true;
    }

    public getDispute(disputeId: string): Dispute {
        return {} as Dispute;
    }

    public getResponse(responseId: string): Response {
        return {} as Response;
    }

    public getRequest(requestId: string): Request<any> {
        return {} as Request<any>;
    }

    public disputeOf(requestId: string): string {
        return '';
    }

    public async proposeResponse(requestId: string, responseData: Response): Promise<string> {
        return '';
    }

    public async disputeResponse(requestId: string, responseId: string): Promise<string> {
        return '';
    }

    public getFinalizedResponse(requestId: string): Response {
        return {} as Response;
    }

    public getResponseIds(requestId: string): string[] {
        return [];
    }

    public listRequests(startFrom: number, amount: number): Request<any>[] {
        return [];
    }

    public finalize(requestId: string, finalizedResponseId: string): void {
        return;
    }

    // --------- CUSTOM FUNCS --------- //
    /**
     * Adds a module to the list of whitelisted modules
     * @param module The address of the module to add
     */
    public addModule(module: Module): void {
        return;
    }

    /**
     * Removes a module from the list of whitelisted modules
     * @param module The address of the module to remove
     */
    public removeModule(module: Module): void {
        return;
    }
}
