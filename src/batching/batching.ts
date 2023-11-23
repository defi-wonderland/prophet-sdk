import { BytesLike } from 'ethers';
import { IOracle } from '../types/typechain';
import { getBatchRequestData } from './getBatchRequestData';
import { DisputeData, getBatchDisputeData } from './getBatchDisputeData';
import { RequestForFinalizeData, getBatchRequestForFinalizeData } from './getBatchRequestForFinalizeData';
import { Helpers } from '../helpers';
import { FullResponse, RequestWithId, ResponseWithId } from '../types/types';
import { getBatchModuleNameData } from './getBatchModuleNameData';

/**
 * @title Batching class
 * @notice Contains methods for batching operations like getting multiple responses or requests
 * that require multiple calls to the rpc
 **/
export class Batching {
  private oracle: IOracle;
  private helpers: Helpers;

  constructor(oracle: IOracle, helpers: Helpers) {
    this.oracle = oracle;
    this.helpers = helpers;
  }

  /**
   * Paginates requests starting from the given index
   * @param startFrom - index to start from
   * @param amount - amount of requests to get
   * @returns array of RequestFullData objects that include the request, its responses, and dispute status
   **/
  public async listRequests(startFrom: number, amount: number): Promise<RequestFullData[]> {
    const result = await getBatchRequestData(this.oracle.runner, await this.oracle.getAddress(), startFrom, amount);

    const requestPromises = result.map(async (request) => {
      const requestWithId: RequestWithId = await this.helpers.getRequest(request.requestId);

      const responsePromises = request.responses.map(async (response) => {
        return await this.helpers.getResponse(response.responseId, Number(response.createdAt));
      });

      const moduleNamesPromise = getBatchModuleNameData(this.oracle.runner, [
        requestWithId.request.requestModule,
        requestWithId.request.responseModule,
        requestWithId.request.disputeModule,
        requestWithId.request.resolutionModule,
        requestWithId.request.finalityModule,
      ]);

      const [responses, moduleNames] = await Promise.all([Promise.all(responsePromises), moduleNamesPromise]);

      const fullResponses: FullResponse[] = responses.map((response, i) => ({
        requestId: request.requestId,
        responseId: request.responses[i].responseId,
        response: response.response,
        blockNumber: response.blockNumber,
        disputeId: request.responses[i].disputeId,
      }));

      const finalizedResponse = fullResponses.find((response) => response.responseId === request.finalizedResponseId);

      return {
        requestWithId: requestWithId,
        responses: fullResponses,
        finalizedResponse: finalizedResponse ? finalizedResponse : null,
        disputeStatus: request.disputeStatus,
        requestModuleName: moduleNames[0],
        responseModuleName: moduleNames[1],
        disputeModuleName: moduleNames[2],
        resolutionModuleName: moduleNames[3],
        finalityModuleName: moduleNames[4],
      };
    });

    const resolvedRequests = await Promise.all(requestPromises);

    return resolvedRequests;
  }

  /**
   * Lists responses for a given request id
   * @param requestId - request id to get responses for
   * @returns array of responses
   **/
  public async listResponses(requestId: BytesLike): Promise<ResponseWithId[]> {
    const responseIds = await this.helpers.getResponseIds(requestId);

    const responsePromises = responseIds.map((responseId) => this.helpers.getResponse(responseId));
    const responses = await Promise.all(responsePromises);

    return responses;
  }

  /**
   * Gets the dispute data for all the requests in the given range
   * @param startFrom - index to start from
   * @param amount - amount of requests to get the disputes of
   * @returns array of DisputeData objects
   */
  public async listDisputes(startFrom: number, amount: number): Promise<DisputeData[]> {
    const result = await getBatchDisputeData(this.oracle.runner, await this.oracle.getAddress(), startFrom, amount);
    return result;
  }

  /**
   * Paginates requests starting from the given index
   * @param startFrom - index to start from
   * @param amount - amount of requests to get
   * @returns array of RequestForFinalizeData objects that include the request and its response ids
   **/
  public async listRequestsForFinalize(startFrom: number, amount: number): Promise<RequestForFinalizeData[]> {
    const result = await getBatchRequestForFinalizeData(
      this.oracle.runner,
      await this.oracle.getAddress(),
      startFrom,
      amount
    );
    return result;
  }
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
