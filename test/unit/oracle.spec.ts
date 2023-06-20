import { expect } from "chai";
import { providers } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import { OpooSDK } from "../../src/oracle";
import { ORACLE } from "../../src/utils";
import { Dispute, DisputeStatus, Response } from "../../src/types/Module";

describe("OpooSDK", () => {
  let oracle: OpooSDK;
  let provider: Provider;

  beforeEach(async () => {
    // We want to define the OpooSDK and the provider here
    provider = new providers.JsonRpcProvider(process.env.TENDERLY_URL);

    oracle = new OpooSDK(provider);
  });

  describe("constructor", () => {
    it("should throw an error if the oracle address is invalid", () => {
      const provider = new providers.JsonRpcProvider("0xBAD");
      expect(new OpooSDK(provider)).to.throw;
    });

    it("should initialize oracle correctly", () => {
      expect(oracle.oracle.address).to.equal(ORACLE);
      expect(oracle.signerOrProvider).to.be.an.instanceOf(
        providers.JsonRpcProvider
      );
    });
  });

  describe("getDispute", () => {
    it("should throw an error if the dispute id is invalid", async () => {
      expect(oracle.getDispute("0xBAD")).to.throw;
    });

    it("should return the dispute data", async () => {
      const mockDispute: Dispute = {
        createdAt: 9999,
        disputer: "0xDisputerAddress",
        proposer: "0xProposerAddress",
        responseId: "ResponseId",
        requestId: "RequestId",
        status: DisputeStatus.Active,
      };

      // Mocking the getDispute function of the oracle contract
      oracle.getDispute = async () => {
        return Promise.resolve(mockDispute);
      };

      const data = await oracle.getDispute("id");
      expect(data).to.equal(mockDispute);
    });
  });

  describe("getResponse", () => {
    it("should throw an error if the response id is invalid", async () => {
      expect(oracle.getResponse("0xBAD")).to.throw;
    });

    it("should return the response data", async () => {
      const mockResponse: Response = {
        createdAt: 9999,
        proposer: "0xProposerAddress",
        requestId: "RequestId",
        disputeId: "disputeId",
        response: "Response",
      };

      // Mocking the getResponse function of the oracle contract
      oracle.getResponse = async () => {
        return Promise.resolve(mockResponse);
      };

      const data = await oracle.getResponse("id");
      expect(data).to.equal(mockResponse);
    });
  });

  describe("getRequest", () => {
    it("should throw an error if the request id is invalid", async () => {
      expect(oracle.getResponse("0xBAD")).to.throw;
    });

    it("should return the request data", async () => {
      const mockRequest = {
        requestModuleData: "RequestModuleData",
        responseModuleData: "ResponseModuleData",
        disputeModuleData: "DisputeModuleData",
        resolutionModuleData: "ResolutionModuleData",
        finalityModuleData: "FinalityModuleData",
        ipfsHash: "IPFSHash",
        requestModule: "RequestModule",
        responseModule: "ResponseModule",
        disputeModule: "DisputeModule",
        resolutionModule: "ResolutionModule",
        finalityModule: "FinalityModule",
        requester: "Requester",
        nonce: 123,
        createdAt: 9999,
      };

      // Mocking the getRequest function of the oracle contract
      oracle.getRequest = async () => {
        return Promise.resolve(mockRequest);
      };

      const data = await oracle.getRequest("id");
      expect(data).to.equal(mockRequest);
    });
  });
});
