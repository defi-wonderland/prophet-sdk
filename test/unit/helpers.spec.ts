import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import { Helpers } from '../../src/helpers';
import { IOracle } from '../../src/types/typechain';
import { IpfsApi } from '../../src/ipfsApi';
import { cidToBytes32 } from '../../src/utils/cid';
import { ethers } from 'ethers';
import { Modules } from '../../src/modules/modules';

describe('Helpers', () => {
  const createRequestResult = 'createRequestResult';
  const getRequestResult = 'getRequestResult';
  const proposeResponseResult = 'proposeResponseResult';
  const getResponseResult = 'getResponseResult';
  const getResponseIdsResult = ['responseId1', 'responseId2'];
  const getFinalizedResponseResult = 'finalizedResponse';
  const listRequestsResult = ['request2', 'request2'];
  const disputeResponseResult = 'disputeResponseResult';
  const createRequestsResult = 'createRequestsResult';
  const allowedModuleResult = 'allowedModuleResult';
  const getDisputeResult = 'getDisputeResult';
  const getFullRequestResult = 'getFullRequestResult';
  const disputeOfResult = 'disputeOfResult';
  const escalateDisputeResult = 'escalationDisputeResult';
  const resolveDisputeResult = 'resolveDisputeResult';
  const listRequestIdsResult = ['requestId1', 'requestId2'];
  const finalizeResult = 'finalizeResult';
  const finalizeResultWithoutResponse = 'finalizeResultWithoutResponse';
  const getRequestMetadataResult = 'getRequestMetadataResult';
  const totalRequestCountResult = 99;
  const getNamedDecodeRequestReturnTypesResult = '{ "0": "int256", "1": "int256" }';
  const deleteResponseResult = 'deleteResponseResult';
  const getFinalizedResponseIdResult = 'getFinalizedResponseIdResult';
  const getRequestByNonceResult = 'getRequestByNonceResult';
  const getRequestIdResult = 'getRequestIdResult';
  const isParticipantResult = 'isParticipantResult';
  const createdAtResult = 1;
  const updateDisputeStatusResult = 'updateDisputeStatusResult';
  const finalizedAtResult = 'finalizedAtResult';
  const createRequestStub: SinonStub = sinon.stub();
  const getRequestStub: SinonStub = sinon.stub();
  const proposeResponseStub: SinonStub = sinon.stub();
  const getResponseStub: SinonStub = sinon.stub();
  const uploadMetadataStub: SinonStub = sinon.stub();
  const getResponseIdsStub: SinonStub = sinon.stub();
  const getFinalizedResponseStub: SinonStub = sinon.stub();
  const queryFilterStub: SinonStub = sinon.stub();
  const disputeResponseStub: SinonStub = sinon.stub();
  const createRequestsStub: SinonStub = sinon.stub();
  const allowedModuleStub: SinonStub = sinon.stub();
  const getDisputeStub: SinonStub = sinon.stub();
  const getFullRequestStub: SinonStub = sinon.stub();
  const disputeOfStub: SinonStub = sinon.stub();
  const escalateDisputeStub: SinonStub = sinon.stub();
  const resolveDisputeStub: SinonStub = sinon.stub();
  const listRequestIdsStub: SinonStub = sinon.stub();
  const finalizeStub: SinonStub = sinon.stub();
  const getRequestMetadataStub: SinonStub = sinon.stub();
  const totalRequestCountStub: SinonStub = sinon.stub();
  const getNamedDecodeRequestReturnTypesStub: SinonStub = sinon.stub();
  const deleteResponseStub: SinonStub = sinon.stub();
  const getFinalizedResponseIdStub: SinonStub = sinon.stub();
  const getRequestByNonceStub: SinonStub = sinon.stub();
  const getRequestIdsStub: SinonStub = sinon.stub();
  const isParticipantStub: SinonStub = sinon.stub();
  const createdAtStub: SinonStub = sinon.stub();
  const updateStatusStub: SinonStub = sinon.stub();
  const finalizedAtStub: SinonStub = sinon.stub();

  const cid = 'QmUKGQzaaM6Gb1c6Re83QXV4WgFqf2J71S7mtUpbsiHpkt';
  const cidBytes32 = cidToBytes32(cid);

  const sampleBytes32 = '0xb4ff0acb4895c1b00daf9ec45a04d4d0192d5d0000de47e266767a8e20ea5fd8';

  const ARBITRATOR_MODULE = '0x457cCf29090fe5A24c19c1bc95F492168C0EaFdb';
  const BONDED_DISPUTE_MODULE = '0x525C7063E7C20997BaaE9bDa922159152D0e8417';
  const BONDED_RESPONSE_MODULE = '0x38a024C0b412B9d1db8BC398140D00F5Af3093D4';
  const CALLBACK_MODULE = '0xB82008565FdC7e44609fA118A4a681E92581e680';
  const HTTP_REQUEST_MODULE = '0x2a810409872AfC346F9B5b26571Fd6eC42EA4849';

  const requestStructMock: sinon.SinonStubbedInstance<IOracle.RequestStruct> = {
    nonce: sinon.stub(),
    requester: sinon.stub(),
    requestModule: sinon.stub(),
    responseModule: sinon.stub(),
    disputeModule: sinon.stub(),
    resolutionModule: sinon.stub(),
    finalityModule: sinon.stub(),
    requestModuleData: sinon.stub(),
    responseModuleData: sinon.stub(),
    disputeModuleData: sinon.stub(),
    resolutionModuleData: sinon.stub(),
    finalityModuleData: sinon.stub(),
  };

  const responseStructMock: sinon.SinonStubbedInstance<IOracle.ResponseStruct> = {
    proposer: sinon.stub(),
    requestId: sinon.stub(),
    response: sinon.stub(),
  };

  const disputeStructMock: sinon.SinonStubbedInstance<IOracle.DisputeStruct> = {
    disputer: sinon.stub(),
    proposer: sinon.stub(),
    responseId: sinon.stub(),
    requestId: sinon.stub(),
  };

  let sampleRequest: IOracle.RequestStruct = {
    requestModuleData: ethers.encodeBytes32String('requestModuleData'),
    responseModuleData: ethers.encodeBytes32String('responseModuleData'),
    disputeModuleData: ethers.encodeBytes32String('disputeModuleData'),
    resolutionModuleData: ethers.encodeBytes32String('resolutionModuleData'),
    finalityModuleData: ethers.encodeBytes32String('finalityModuleData'),
    requestModule: HTTP_REQUEST_MODULE,
    responseModule: BONDED_RESPONSE_MODULE,
    disputeModule: BONDED_DISPUTE_MODULE,
    resolutionModule: ARBITRATOR_MODULE,
    finalityModule: CALLBACK_MODULE,
    nonce: 1,
    requester: '0x102EEA73631BaB024C55540B048FEA1e43271962',
  };

  let sampleRequestMetadata = {
    responseType: 'uint',
    description: '',
    returnedTypes: {
      '0x123': {
        '0x456': { '0x789': ['int256', 'int256'] },
      },
    },
  };

  const queryFilterMapMock = {
    map: () => {
      return queryFilterFindMock;
    },
  };
  const queryFilterFindMockResult = ['request1', 'request2'];
  const queryFilterFindMock = {
    find: () => {
      return queryFilterFindMockResult;
    },
  };
  const oracleMock = {
    createRequest: createRequestStub.resolves(createRequestResult),
    getRequest: getRequestStub.resolves(getRequestResult),
    proposeResponse: proposeResponseStub.resolves(proposeResponseResult),
    getResponse: getResponseStub.resolves(getResponseResult),
    getResponseIds: getResponseIdsStub.resolves(getResponseIdsResult),
    getFinalizedResponse: getFinalizedResponseStub.resolves(getFinalizedResponseResult),
    queryFilter: queryFilterStub.resolves(queryFilterMapMock),
    filters: {
      RequestCreated: 'RequestCreated',
      ResponseProposed: 'ResponseProposed',
      ResponseDisputed: 'ResponseDisputed',
    },
    disputeResponse: disputeResponseStub.resolves(disputeResponseResult),
    createRequests: createRequestsStub.resolves(createRequestsResult),
    allowedModule: allowedModuleStub.resolves(allowedModuleResult),
    getDispute: getDisputeStub.resolves(getDisputeResult),
    getFullRequest: getFullRequestStub.resolves(getFullRequestResult),
    disputeOf: disputeOfStub.resolves(disputeOfResult),
    escalateDispute: escalateDisputeStub.resolves(escalateDisputeResult),
    resolveDispute: resolveDisputeStub.resolves(resolveDisputeResult),
    listRequestIds: listRequestIdsStub.resolves(listRequestIdsResult),
    finalize: finalizeStub.resolves(finalizeResult),
    totalRequestCount: totalRequestCountStub.resolves(totalRequestCountResult),
    deleteResponse: deleteResponseStub.resolves(deleteResponseResult),
    getFinalizedResponseId: getFinalizedResponseIdStub.resolves(getFinalizedResponseIdResult),
    getRequestByNonce: getRequestByNonceStub.resolves(getRequestByNonceResult),
    getRequestId: getRequestIdsStub.resolves(getRequestIdResult),
    isParticipant: isParticipantStub.resolves(isParticipantResult),
    createdAt: createdAtStub.resolves(createdAtResult),
    updateDisputeStatus: updateStatusStub.resolves(updateDisputeStatusResult),
    finalizedAt: finalizedAtStub.resolves(finalizedAtResult),
  };

  const mockIpfsApi = {
    uploadMetadata: uploadMetadataStub.resolves(cidBytes32),
    getMetadata: getRequestMetadataStub.resolves(getRequestMetadataResult),
  };

  const mockModules = {
    knownModules: {
      [ARBITRATOR_MODULE]: [],
      [BONDED_DISPUTE_MODULE]: [],
      [BONDED_RESPONSE_MODULE]: [],
      [CALLBACK_MODULE]: [],
      [HTTP_REQUEST_MODULE]: [],
    },
    getNamedDecodeRequestReturnTypes: getNamedDecodeRequestReturnTypesStub.resolves(
      getNamedDecodeRequestReturnTypesResult
    ),
  };

  let helpers: Helpers;
  beforeEach(async () => {
    helpers = new Helpers(oracleMock as unknown as IOracle, mockIpfsApi as IpfsApi, mockModules as unknown as Modules);
  });

  describe('createRequest', () => {
    it('call to createRequest', async () => {
      const result = await helpers.createRequest(sampleRequest, sampleRequestMetadata);
      expect(uploadMetadataStub.calledWith(sampleRequestMetadata)).to.be.true;
      // TODO: should call it with ipfs hash too
      expect(createRequestStub.calledWith(sampleRequest)).to.be.true;
      expect(result).to.equal(createRequestResult);
    });

    it('throws error if invalid response type', async () => {
      const invalidRequestMetadata = {
        responseType: 'uint7',
        description: '',
        returnedTypes: {
          '0x123': {
            '0x456': { '0x789': ['int256', 'int256'] },
          },
        },
      };

      try {
        await helpers.createRequest(sampleRequest, invalidRequestMetadata);
      } catch (e) {
        expect(e.message).to.equal('Invalid response type: uint7');
      }
    });

    it('throws error if ipfs hash and request metadata are not provided', async () => {
      try {
        await helpers.createRequest(sampleRequest);
      } catch (e) {
        expect(e.message).to.equal('Request metadata or ipfs hash must be provided');
      }
    });

    it("throws error if it doesn't have the decodeRequest return types", async () => {
      const mockModules = {
        knownModules: {
          [ARBITRATOR_MODULE]: [],
          [BONDED_DISPUTE_MODULE]: [],
          [BONDED_RESPONSE_MODULE]: [],
          [CALLBACK_MODULE]: [],
          [HTTP_REQUEST_MODULE]: [],
        },
        getNamedDecodeRequestReturnTypes: getNamedDecodeRequestReturnTypesStub.resolves(
          '(string _url,uint256 _bondSize,address _bondToken)'
        ),
      };

      helpers.setModules(mockModules as any);
      try {
        await helpers.createRequest(sampleRequest, sampleRequestMetadata);
      } catch (e) {
        expect(e.message).to.equal(`responseModule: ${BONDED_RESPONSE_MODULE} is not a known module`);
      }
    });

    it('call upload metadata with the decodeRequest return types', async () => {
      const getNamedDecodeRequestReturnTypesStub: SinonStub = sinon.stub();

      const mockModules = {
        knownModules: {
          [ARBITRATOR_MODULE]: [],
          [BONDED_DISPUTE_MODULE]: [],
          [BONDED_RESPONSE_MODULE]: [],
          [CALLBACK_MODULE]: [],
          [HTTP_REQUEST_MODULE]: [],
        },
        getNamedDecodeRequestReturnTypes: getNamedDecodeRequestReturnTypesStub.resolves(
          '(string _url,uint256 _bondSize,address _bondToken)'
        ),
      };

      helpers.setModules(mockModules as any);

      await helpers.createRequest(sampleRequest, sampleRequestMetadata);
      expect(uploadMetadataStub.calledWith(sampleRequestMetadata)).to.be.true;
      expect(createRequestStub.calledWith(sampleRequest)).to.be.true;

      // Checking that the request metadata is updated with the decodeRequest return types
      expect(sampleRequestMetadata).to.deep.equal({
        responseType: 'uint',
        description: '',
        returnedTypes: {
          [ARBITRATOR_MODULE]: '(string _url,uint256 _bondSize,address _bondToken)',
          [BONDED_DISPUTE_MODULE]: '(string _url,uint256 _bondSize,address _bondToken)',
          [BONDED_RESPONSE_MODULE]: '(string _url,uint256 _bondSize,address _bondToken)',
          [CALLBACK_MODULE]: '(string _url,uint256 _bondSize,address _bondToken)',
          [HTTP_REQUEST_MODULE]: '(string _url,uint256 _bondSize,address _bondToken)',
        },
      });
    });
  });

  describe('proposeResponse', () => {
    it('call to proposeResponse', async () => {
      const result = await helpers.proposeResponse(requestStructMock, responseStructMock);
      expect(proposeResponseStub.calledWith(requestStructMock, responseStructMock)).to.be.true;
      expect(result).to.equal(proposeResponseResult);
    });
  });

  describe('getResponseIds', () => {
    it('call to getResponseIds', async () => {
      const result = await helpers.getResponseIds('1');
      expect(getResponseIdsStub.calledWith('1')).to.be.true;
      expect(result).to.be.equal(getResponseIdsResult);
    });
  });

  describe('getFinalizedResponseId', () => {
    it('call to getFinalizedResponseId', async () => {
      const result = await helpers.getFinalizedResponseId('1');
      expect(getFinalizedResponseIdStub.calledWith('1')).to.be.true;
      expect(result).to.be.equal(getFinalizedResponseIdResult);
    });
  });

  describe('listRequests', () => {
    it('call to listRequests', async () => {
      const result = await helpers.listRequests(0, 10);
      expect(queryFilterStub.calledWith('RequestCreated', 0, 10)).to.be.true;
      expect(result).to.be.equal(queryFilterFindMock);
    });
  });

  describe('disputeResponse', () => {
    it('call to disputeResponse', async () => {
      const result = await helpers.disputeResponse(requestStructMock, responseStructMock, disputeStructMock);
      expect(disputeResponseStub.calledWith(requestStructMock, responseStructMock, disputeStructMock)).to.be.true;
      expect(result).to.be.equal(disputeResponseResult);
    });
  });

  describe('disputeStatus', () => {
    it('call to disputeStatus', async () => {
      const result = await helpers.disputeOf(sampleBytes32);
      expect(disputeOfStub.calledWith(sampleBytes32));
      expect(result).to.be.equal(disputeOfResult);
    });
  });

  describe('createRequests', () => {
    it('call to createRequests', async () => {
      const result = await helpers.createRequests([sampleRequest], [sampleRequestMetadata]);
      expect(uploadMetadataStub.calledWith(sampleRequestMetadata)).to.be.true;
      // TODO: should call it with ipfs hash too
      expect(createRequestsStub.calledWith([sampleRequest])).to.be.true;
      expect(result).to.equal(createRequestsResult);
    });

    it('throws error if requests and metadata length mismatch', async () => {
      try {
        await helpers.createRequests([sampleRequest], [sampleRequestMetadata, sampleRequestMetadata]);
      } catch (e) {
        expect(e.message).to.equal('Requests data and metadata must be the same length');
      }
    });
  });

  describe('allowedModule', () => {
    it('calls to allowedModule', async () => {
      const result = await helpers.allowedModule(sampleBytes32, '0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A');
      expect(allowedModuleStub.calledWith(sampleBytes32, '0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A')).to.be.true;
      expect(result).to.equal(allowedModuleResult);
    });
  });

  describe('createdAt', () => {
    it('calls to createdAt', async () => {
      const result = await helpers.createdAt(sampleBytes32);
      expect(createdAtStub.calledWith(sampleBytes32)).to.be.true;
      expect(result).to.equal(createdAtResult);
    });
  });

  describe('finalizedAt', () => {
    it('calls to finalizedAt', async () => {
      const result = await helpers.finalizedAt(sampleBytes32);
      expect(finalizedAtStub.calledWith(sampleBytes32)).to.be.true;
      expect(result).to.equal(finalizedAtResult);
    });
  });

  /*
  describe('getFullRequest', () => {
    it('calls to getFullRequest', async () => {
      const result = await helpers.getFullRequest(sampleBytes32);
      expect(getFullRequestStub.calledWith(sampleBytes32)).to.be.true;
      expect(result).to.equal(getFullRequestResult);
    });
  });
  */

  describe('disputeOf', () => {
    it('calls to disputeOf', async () => {
      const result = await helpers.disputeOf(sampleBytes32);
      expect(disputeOfStub.calledWith(sampleBytes32)).to.be.true;
      expect(result).to.equal(disputeOfResult);
    });
  });

  describe('escalateDispute', () => {
    it('calls to escalateDispute', async () => {
      const result = await helpers.escalateDispute(requestStructMock, responseStructMock, disputeStructMock);
      expect(escalateDisputeStub.calledWith(requestStructMock, responseStructMock, disputeStructMock)).to.be.true;
      expect(result).to.equal(escalateDisputeResult);
    });
  });

  describe('resolveDispute', () => {
    it('calls to resolveDispute', async () => {
      const result = await helpers.resolveDispute(requestStructMock, responseStructMock, disputeStructMock);
      expect(resolveDisputeStub.calledWith(requestStructMock, responseStructMock, disputeStructMock)).to.be.true;
      expect(result).to.equal(resolveDisputeResult);
    });
  });

  describe('updateDisputeStatus', () => {
    it('calls to updateDisputeStatus', async () => {
      const result = await helpers.updateDisputeStatus(requestStructMock, responseStructMock, disputeStructMock, 1);
      expect(updateStatusStub.calledWith(requestStructMock, responseStructMock, disputeStructMock, 1)).to.be.true;
      expect(result).to.equal(updateDisputeStatusResult);
    });
  });

  describe('listRequestIds', () => {
    it('calls to listRequestIds', async () => {
      const result = await helpers.listRequestIds(0, 10);
      expect(listRequestIdsStub.calledWith(0, 10)).to.be.true;
      expect(result).to.equal(listRequestIdsResult);
    });
  });

  describe('finalize', () => {
    it('calls to finalize', async () => {
      const result = await helpers.finalize(requestStructMock, responseStructMock);
      expect(finalizeStub.calledWith(requestStructMock, responseStructMock)).to.be.true;
      expect(result).to.equal(finalizeResult);
    });
  });

  describe('getRequest', () => {
    it('calls to createdAt and calls to queryFilter', async () => {
      const result = await helpers.getRequest(sampleBytes32);
      expect(createdAtStub.calledWith(sampleBytes32)).to.be.true;
      expect(queryFilterStub.calledWith('RequestCreated', createdAtResult, createdAtResult + 1)).to.be.true;
      expect(result).to.equal(queryFilterFindMockResult);
    });
  });

  describe('getResponse', () => {
    it('calls to createdAt and calls to queryFilter', async () => {
      const result = await helpers.getResponse(sampleBytes32);
      expect(createdAtStub.calledWith(sampleBytes32)).to.be.true;
      expect(queryFilterStub.calledWith('ResponseProposed', createdAtResult, createdAtResult + 1)).to.be.true;
      expect(result).to.equal(queryFilterFindMockResult);
    });
  });

  describe('getDispute', () => {
    it('calls to createdAt and calls to queryFilter', async () => {
      const result = await helpers.getDispute(sampleBytes32);
      expect(createdAtStub.calledWith(sampleBytes32)).to.be.true;
      expect(queryFilterStub.calledWith('ResponseDisputed', createdAtResult, createdAtResult + 1)).to.be.true;
      expect(result).to.equal(queryFilterFindMockResult);
    });
  });

  describe('getRequestMetadata', () => {
    it('calls to ipfsApi getRequestMetadata', async () => {
      const result = await helpers.getRequestMetadata(cidBytes32);
      expect(getRequestMetadataStub.calledWith(cid)).to.be.true;
      expect(result).to.equal(getRequestMetadataResult);
    });
  });

  describe('getFullRequestWithMetadata', () => {
    it('calls to getFullRequest and getRequestMetadata', async () => {
      const requestSample = { ipfsHash: cidBytes32 }; // we just care about ipfs hash here
      const requestMetadataSample = { responseType: 'uint', description: 'uint' };

      const getRequestStub = sinon.stub(helpers, 'getRequest');
      getRequestStub.withArgs(sampleBytes32).resolves(requestSample);

      const getRequestMetadataStub = sinon.stub(helpers, 'getRequestMetadata');
      getRequestMetadataStub.withArgs(cidBytes32).resolves(requestMetadataSample);

      const result = await helpers.getRequestWithMetadata(sampleBytes32);

      expect(getRequestStub.calledWith(sampleBytes32)).to.be.true;
      expect(getRequestMetadataStub.calledWith(cidBytes32)).to.be.true;

      expect(result).to.deep.equal({
        request: requestSample,
        metadata: requestMetadataSample,
      });
    });
  });

  describe('totalRequestCount', () => {
    it('calls to totalRequestCount', async () => {
      const result = await helpers.totalRequestCount();
      expect(totalRequestCountStub.called).to.be.true;
      expect(result).to.equal(totalRequestCountResult);
    });
  });

  describe('call static methods', () => {
    // Just defined some of the methods to test the callStatic method
    const oracleMock = {
      createRequest: { staticCall: createRequestStub.resolves(createRequestResult) },
      ['proposeResponse(bytes32,bytes)']: { staticCall: proposeResponseStub.resolves(proposeResponseResult) },
      disputeResponse: { staticCall: disputeResponseStub.resolves(disputeResponseResult) },
      createRequests: { staticCall: createRequestsStub.resolves(createRequestsResult) },
      escalateDispute: { staticCall: escalateDisputeStub.resolves(escalateDisputeResult) },
      resolveDispute: { staticCall: resolveDisputeStub.resolves(resolveDisputeResult) },
      ['finalize(bytes32,bytes32)']: { staticCall: finalizeStub.resolves(finalizeResult) },
      totalRequestCount: { staticCall: totalRequestCountStub.resolves(totalRequestCountResult) },
      deleteResponse: { staticCall: deleteResponseStub.resolves(deleteResponseResult) },
    };

    beforeEach(async () => {
      helpers = new Helpers(
        oracleMock as unknown as IOracle,
        mockIpfsApi as IpfsApi,
        mockModules as unknown as Modules
      );
    });

    it('calls to createRequest static call', async () => {
      const result = await helpers.callStatic('createRequest', sampleRequest);
      expect(result).to.equal(createRequestResult);
      expect(createRequestStub.calledWith(sampleRequest)).to.be.true;
    });

    it('calls to proposeResponse static call', async () => {
      const result = await helpers.callStatic('proposeResponse(bytes32,bytes)', '1', 'responseData');
      expect(proposeResponseStub.calledWith('1', 'responseData')).to.be.true;
      expect(result).to.equal(proposeResponseResult);
    });

    it('calls to disputeResponse static call', async () => {
      const result = await helpers.callStatic('disputeResponse', '1', '2');
      expect(disputeResponseStub.calledWith('1', '2')).to.be.true;
      expect(result).to.be.equal(disputeResponseResult);
    });

    it('calls to createRequests static call', async () => {
      const result = await helpers.callStatic('createRequests', [sampleRequest]);
      expect(createRequestsStub.calledWith([sampleRequest])).to.be.true;
      expect(result).to.equal(createRequestsResult);
    });

    it('calls to escalateDispute static call', async () => {
      const result = await helpers.callStatic('escalateDispute', sampleBytes32);
      expect(escalateDisputeStub.calledWith(sampleBytes32)).to.be.true;
      expect(result).to.equal(escalateDisputeResult);
    });

    it('calls to resolveDispute static call', async () => {
      const result = await helpers.callStatic('resolveDispute', sampleBytes32);
      expect(resolveDisputeStub.calledWith(sampleBytes32)).to.be.true;
      expect(result).to.equal(resolveDisputeResult);
    });

    it('calls to finalize static call', async () => {
      const result = await helpers.callStatic(
        'finalize(bytes32,bytes32)',
        sampleBytes32,
        '0xc5ff0acb4895c1b00daf9ec45a04d4d0192d5d0000de47e266767a8e20ea5fd7'
      );
      expect(
        finalizeStub.calledWith(sampleBytes32, '0xc5ff0acb4895c1b00daf9ec45a04d4d0192d5d0000de47e266767a8e20ea5fd7')
      ).to.be.true;
      expect(result).to.equal(finalizeResult);
    });

    it('calls to totalRequestCount static call', async () => {
      const result = await helpers.callStatic('totalRequestCount');
      expect(totalRequestCountStub.called).to.be.true;
      expect(result).to.equal(totalRequestCountResult);
    });

    it('calls to deleteResponse static call', async () => {
      const result = await helpers.callStatic('deleteResponse', sampleBytes32);
      expect(deleteResponseStub.calledWith(sampleBytes32)).to.be.true;
      expect(result).to.equal(deleteResponseResult);
    });
  });

  describe('getFinalizedResponseId', () => {
    it('calls to getFinalizedResponseId', async () => {
      const result = await helpers.getFinalizedResponseId(sampleBytes32);
      expect(getFinalizedResponseIdStub.calledWith(sampleBytes32)).to.be.true;
      expect(result).to.equal(getFinalizedResponseIdResult);
    });
  });

  describe('getRequestId', () => {
    it('calls to getRequestId', async () => {
      const result = await helpers.getRequestId(1);
      expect(getRequestIdsStub.calledWith(1)).to.be.true;
      expect(result).to.equal(getRequestIdResult);
    });
  });

  describe('isParticipant', () => {
    it('calls to isParticipant', async () => {
      const result = await helpers.isParticipant(sampleBytes32, '0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A');
      expect(isParticipantStub.calledWith(sampleBytes32, '0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A')).to.be.true;
      expect(result).to.equal(isParticipantResult);
    });
  });
});
