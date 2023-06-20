import {
  Address,
  Request,
  Dispute,
  Response,
  DisputeStatus,
  Modules,
} from "./types/index";
import { Contract, ethers, Signer } from "ethers";
import { abi as IAbiOracle } from "opoo-core/abi/IOracle.json";
import { ORACLE } from "./utils/index";
import { Provider } from "@ethersproject/abstract-provider";

export class OpooSDK {
  /**
   * The contract of the Oracle to use
   */
  public oracle: Contract;

  /**
   * The addresses of the Modules to use
   */
  public whitelistedModules: Modules;

  /**
   * The signer or provider to use
   */
  public signerOrProvider: Provider | Signer;

  /**
   * Constructor
   */
  constructor(signerOrProvider: Provider | Signer) {
    this.signerOrProvider = signerOrProvider;

    try {
      this.oracle = new ethers.Contract(
        ORACLE,
        IAbiOracle,
        this.signerOrProvider
      );
    } catch (e) {
      throw new Error(`Failed to create oracle contract ${e}`);
    }
  }

  // --------- CONTRACT WRAPPED FUNCS --------- //
  /**
   * Creates a new request, calls the Oracle's createRequest function
   * @param request The request to create
   * @returns The ID of the created request
   */
  public async createRequest() {
    return;
  }

  public validModule(requestId: string, module: Address): boolean {
    return true;
  }

  /**
   * Get a specific dispute using dispute id
   * @param disputeId The dispute id
   * @returns The dispute object
   */
  public async getDispute(disputeId: string): Promise<Dispute> {
    // Call get dispute using dispute id
    const tx = await this.oracle.getDispute(disputeId);

    // Wait for the transaction to be mined
    await tx.wait();

    // Create dispute object
    const dispute: Dispute = {
      createdAt: tx.createdAt,
      disputer: tx.disputer,
      proposer: tx.proposer,
      responseId: tx.responseId,
      requestId: tx.requestId,
      status: tx.status,
    };

    // Return dispute
    return dispute;
  }

  /**
   * Get a specific response using response id
   * @param disputeId The response id
   * @returns The response object
   */
  public async getResponse(responseId: string): Promise<Response> {
    // Call get response using response id
    const tx = await this.oracle.getResponse(responseId);

    // Wait for the transaction to be mined
    await tx.wait();

    // Create response object
    const response: Response = {
      createdAt: tx.createdAt,
      proposer: tx.proposer,
      requestId: tx.requestId,
      disputeId: tx.disputeId,
      response: tx.response
    };

    // Return response
    return response;
  }

  /**
   * Get a specific resquest using request id
   * @param disputeId The request id
   * @returns The request object
   */
  public async getRequest(requestId: string): Promise<Request<any>> {
    // Call get request using request id
    const tx = await this.oracle.getResponse(requestId);

    // Wait for the transaction to be mined
    await tx.wait();

    const request: Request<any> = {
      requestModuleData: tx.requestModuleData,
      responseModuleData: tx.responseModuleData,
      disputeModuleData: tx.disputeModuleData,
      resolutionModuleData: tx.resolutionModuleData,
      finalityModuleData: tx.finalityModuleData,
      ipfsHash: tx.ipfsHash,
      requestModule: tx.requestModule,
      responseModule: tx.responseModule,
      disputeModule: tx.disputeModule,
      resolutionModule: tx.resolutionModule,
      finalityModule: tx.finalityModule,
      requester: tx.requester,
      nonce: tx.nonce,
      createdAt: tx.createdAt,
    };

    // Create request object
    return request;
  }

  public disputeOf(requestId: string): string {
    return "";
  }

  public async proposeResponse(
    requestId: string,
    responseData: Response
  ): Promise<string> {
    return "";
  }

  public async disputeResponse(
    requestId: string,
    responseId: string
  ): Promise<string> {
    return "";
  }

  public getFinalizedResponse(requestId: string): Response {
    return {} as Response;
  }

  public getResponseIds(requestId: string): string[] {
    return [];
  }

  public updateDisputeStatus(disputeId: string, status: DisputeStatus): void {
    return;
  }

  public listRequests(startFrom: number, amount: number): Request<any>[] {
    return [];
  }

  // --------- CUSTOM FUNCS --------- //
  /**
   * Adds a module to the list of whitelisted modules
   * @param module The address of the module to add
   */
  public addModule(module: Modules): void {
    return;
  }

  /**
   * Removes a module from the list of whitelisted modules
   * @param module The address of the module to remove
   */
  public removeModule(module: Modules): void {
    return;
  }
}
