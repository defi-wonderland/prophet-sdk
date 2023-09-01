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
  const validModuleResult = 'validModuleResult';
  const getDisputeResult = 'getDisputeResult';
  const getFullRequestResult = 'getFullRequestResult';
  const disputeOfResult = 'disputeOfResult';
  const escalationDisputeResult = 'escalationDisputeResult';
  const resolveDisputeResult = 'resolveDisputeResult';
  const listRequestIdsResult = ['requestId1', 'requestId2'];
  const finalizeResult = 'finalizeResult';
  const finalizeResultWithoutResponse = 'finalizeResultWithoutResponse';
  const getRequestMetadataResult = 'getRequestMetadataResult';
  const totalRequestCountResult = 99;
  const getNamedDecodeRequestReturnTypesResult = '{ "0": "int256", "1": "int256" }';
  const deleteResponseResult = 'deleteResponseResult';

  const createRequestStub: SinonStub = sinon.stub();
  const getRequestStub: SinonStub = sinon.stub();
  const proposeResponseStub: SinonStub = sinon.stub();
  const getResponseStub: SinonStub = sinon.stub();
  const uploadMetadataStub: SinonStub = sinon.stub();
  const getResponseIdsStub: SinonStub = sinon.stub();
  const getFinalizedResponseStub: SinonStub = sinon.stub();
  const listRequestStub: SinonStub = sinon.stub();
  const disputeResponseStub: SinonStub = sinon.stub();
  const createRequestsStub: SinonStub = sinon.stub();
  const validModuleStub: SinonStub = sinon.stub();
  const getDisputeStub: SinonStub = sinon.stub();
  const getFullRequestStub: SinonStub = sinon.stub();
  const disputeOfStub: SinonStub = sinon.stub();
  const escalationDisputeStub: SinonStub = sinon.stub();
  const resolveDisputeStub: SinonStub = sinon.stub();
  const listRequestIdsStub: SinonStub = sinon.stub();
  const finalizeStub: SinonStub = sinon.stub();
  const getRequestMetadataStub: SinonStub = sinon.stub();
  const totalRequestCountStub: SinonStub = sinon.stub();
  const getNamedDecodeRequestReturnTypesStub: SinonStub = sinon.stub();
  const deleteResponseStub: SinonStub = sinon.stub();
  const finalizeWithoutResponseStub: SinonStub = sinon.stub();

  const cid = 'QmUKGQzaaM6Gb1c6Re83QXV4WgFqf2J71S7mtUpbsiHpkt';
  const cidBytes32 = cidToBytes32(cid);

  const sampleBytes32 = '0xb4ff0acb4895c1b00daf9ec45a04d4d0192d5d0000de47e266767a8e20ea5fd8';

  const ARBITRATOR_MODULE = '0x457cCf29090fe5A24c19c1bc95F492168C0EaFdb';
  const BONDED_DISPUTE_MODULE = '0x525C7063E7C20997BaaE9bDa922159152D0e8417';
  const BONDED_RESPONSE_MODULE = '0x38a024C0b412B9d1db8BC398140D00F5Af3093D4';
  const CALLBACK_MODULE = '0xB82008565FdC7e44609fA118A4a681E92581e680';
  const HTTP_REQUEST_MODULE = '0x2a810409872AfC346F9B5b26571Fd6eC42EA4849';

  let sampleRequest = {
    requestModuleData: ethers.encodeBytes32String('requestModuleData'),
    responseModuleData: ethers.encodeBytes32String('responseModuleData'),
    disputeModuleData: ethers.encodeBytes32String('disputeModuleData'),
    resolutionModuleData: ethers.encodeBytes32String('resolutionModuleData'),
    finalityModuleData: ethers.encodeBytes32String('finalityModuleData'),
    ipfsHash: ethers.encodeBytes32String('ipfsHash'),
    requestModule: HTTP_REQUEST_MODULE,
    responseModule: BONDED_RESPONSE_MODULE,
    disputeModule: BONDED_DISPUTE_MODULE,
    resolutionModule: ARBITRATOR_MODULE,
    finalityModule: CALLBACK_MODULE,
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

  const oracleMock = {
    createRequest: createRequestStub.resolves(createRequestResult),
    getRequest: getRequestStub.resolves(getRequestResult),
    ['proposeResponse(bytes32,bytes)']: proposeResponseStub.resolves(proposeResponseResult),
    ['proposeResponse(address,bytes32,bytes)']: proposeResponseStub.resolves(proposeResponseResult),
    getResponse: getResponseStub.resolves(getResponseResult),
    getResponseIds: getResponseIdsStub.resolves(getResponseIdsResult),
    getFinalizedResponse: getFinalizedResponseStub.resolves(getFinalizedResponseResult),
    listRequests: listRequestStub.resolves(listRequestsResult),
    disputeResponse: disputeResponseStub.resolves(disputeResponseResult),
    createRequests: createRequestsStub.resolves(createRequestsResult),
    validModule: validModuleStub.resolves(validModuleResult),
    getDispute: getDisputeStub.resolves(getDisputeResult),
    getFullRequest: getFullRequestStub.resolves(getFullRequestResult),
    disputeOf: disputeOfStub.resolves(disputeOfResult),
    escalateDispute: escalationDisputeStub.resolves(escalationDisputeResult),
    resolveDispute: resolveDisputeStub.resolves(resolveDisputeResult),
    listRequestIds: listRequestIdsStub.resolves(listRequestIdsResult),
    ['finalize(bytes32,bytes32)']: finalizeStub.resolves(finalizeResult),
    ['finalize(bytes32)']: finalizeWithoutResponseStub.resolves(finalizeResultWithoutResponse),
    totalRequestCount: totalRequestCountStub.resolves(totalRequestCountResult),
    deleteResponse: deleteResponseStub.resolves(deleteResponseResult),
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

  describe('createRequestWithoutMetadata', () => {
    it('call to createRequest', async () => {
      const result = await helpers.createRequestWithoutMetadata(sampleRequest);
      expect(result).to.equal(createRequestResult);
      expect(createRequestStub.calledWith(sampleRequest)).to.be.true;
    });
  });

  describe('createRequest', () => {
    it('call to createRequest', async () => {
      const result = await helpers.createRequest(sampleRequest, sampleRequestMetadata);
      expect(uploadMetadataStub.calledWith(sampleRequestMetadata)).to.be.true;
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

    it("throws error if it doesn't have the decodeRequest return types", async () => {
      const mockModules = {
        knownModules: {
          [ARBITRATOR_MODULE]: [],
          [BONDED_DISPUTE_MODULE]: [],
          // [BONDED_RESPONSE_MODULE]: [], // Commented out to test the error
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

  describe('getRequest', () => {
    it('call to getRequest', async () => {
      const result = await helpers.getRequest('1');
      expect(getRequestStub.calledWith('1')).to.be.true;
      expect(result).to.equal(getRequestResult);
    });
  });

  describe('proposeResponse', () => {
    it('call to proposeResponse', async () => {
      const result = await helpers.proposeResponse('1', 'responseData');
      expect(proposeResponseStub.calledWith('1', 'responseData')).to.be.true;
      expect(result).to.equal(proposeResponseResult);
    });
  });

  describe('getResponse', () => {
    it('call to getResponse', async () => {
      const result = await helpers.getResponse('1');
      expect(getResponseStub.calledWith('1')).to.be.true;
      expect(result).to.equal(getResponseResult);
    });
  });

  describe('getResponseIds', () => {
    it('call to getResponseIds', async () => {
      const result = await helpers.getResponseIds('1');
      expect(getResponseIdsStub.calledWith('1')).to.be.true;
      expect(result).to.be.equal(getResponseIdsResult);
    });
  });

  describe('getFinalizedResponse', () => {
    it('call to getFinalizedResponse', async () => {
      const result = await helpers.getFinalizedResponse('1');
      expect(getFinalizedResponseStub.calledWith('1')).to.be.true;
      expect(result).to.be.equal(getFinalizedResponseResult);
    });
  });

  describe('listRequests', () => {
    it('call to listRequests', async () => {
      const result = await helpers.listRequests(0, 10);
      expect(listRequestStub.calledWith(0, 10)).to.be.true;
      expect(result).to.be.equal(listRequestsResult);
    });
  });

  describe('disputeResponse', () => {
    it('call to disputeResponse', async () => {
      const result = await helpers.disputeResponse('1', '2');
      expect(disputeResponseStub.calledWith('1', '2')).to.be.true;
      expect(result).to.be.equal(disputeResponseResult);
    });
  });

  describe('createRequests', () => {
    it('call to createRequests', async () => {
      const result = await helpers.createRequests([sampleRequest], [sampleRequestMetadata]);
      expect(uploadMetadataStub.calledWith(sampleRequestMetadata)).to.be.true;
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

  describe('validModule', () => {
    it('calls to validModule', async () => {
      const result = await helpers.validModule(sampleBytes32, '0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A');
      expect(validModuleStub.calledWith(sampleBytes32, '0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A')).to.be.true;
      expect(result).to.equal(validModuleResult);
    });
  });

  describe('getDispute', () => {
    it('calls to getDispute', async () => {
      const result = await helpers.getDispute(sampleBytes32);
      expect(getDisputeStub.calledWith(sampleBytes32)).to.be.true;
      expect(result).to.equal(getDisputeResult);
    });
  });

  describe('getFullRequest', () => {
    it('calls to getFullRequest', async () => {
      const result = await helpers.getFullRequest(sampleBytes32);
      expect(getFullRequestStub.calledWith(sampleBytes32)).to.be.true;
      expect(result).to.equal(getFullRequestResult);
    });
  });

  describe('disputeOf', () => {
    it('calls to disputeOf', async () => {
      const result = await helpers.disputeOf(sampleBytes32);
      expect(disputeOfStub.calledWith(sampleBytes32)).to.be.true;
      expect(result).to.equal(disputeOfResult);
    });
  });

  describe('escalateDispute', () => {
    it('calls to escalateDispute', async () => {
      const result = await helpers.escalateDispute(sampleBytes32);
      expect(escalationDisputeStub.calledWith(sampleBytes32)).to.be.true;
      expect(result).to.equal(escalationDisputeResult);
    });
  });

  describe('resolveDispute', () => {
    it('calls to resolveDispute', async () => {
      const result = await helpers.resolveDispute(sampleBytes32);
      expect(resolveDisputeStub.calledWith(sampleBytes32)).to.be.true;
      expect(result).to.equal(resolveDisputeResult);
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
      const result = await helpers.finalize(
        sampleBytes32,
        '0xc5ff0acb4895c1b00daf9ec45a04d4d0192d5d0000de47e266767a8e20ea5fd7'
      );
      expect(
        finalizeStub.calledWith(sampleBytes32, '0xc5ff0acb4895c1b00daf9ec45a04d4d0192d5d0000de47e266767a8e20ea5fd7')
      ).to.be.true;
      expect(result).to.equal(finalizeResult);
    });
  });

  describe('finalizeWithoutResponse', () => {
    it('calls to finalize without response', async () => {
      const result = await helpers.finalize(sampleBytes32);
      expect(finalizeWithoutResponseStub.calledWith(sampleBytes32)).to.be.true;
      expect(result).to.equal(finalizeResultWithoutResponse);
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
      const fullRequestSample = { ipfsHash: cidBytes32 }; // we just care about ipfs hash here
      const requestMetadataSample = { responseType: 'uint', description: 'uint' };

      const helpersGetFullRequestStub = sinon.stub(helpers, 'getFullRequest');
      helpersGetFullRequestStub.withArgs(sampleBytes32).resolves(fullRequestSample);

      const helpersGetRequestMetadataStub = sinon.stub(helpers, 'getRequestMetadata');
      helpersGetRequestMetadataStub.withArgs(cidBytes32).resolves(requestMetadataSample);

      const result = await helpers.getFullRequestWithMetadata(sampleBytes32);

      expect(helpersGetFullRequestStub.calledWith(sampleBytes32)).to.be.true;
      expect(helpersGetRequestMetadataStub.calledWith(cidBytes32)).to.be.true;

      expect(result).to.deep.equal({
        fullRequest: fullRequestSample,
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

  describe('deleteResponse', () => {
    it('calls to deleteResponse', async () => {
      const result = await helpers.deleteResponse(sampleBytes32);
      expect(deleteResponseStub.calledWith(sampleBytes32)).to.be.true;
      expect(result).to.equal(deleteResponseResult);
    });
  });

  describe('call static methods', () => {
    // Just defined some of the methods to test the callStatic method
    const oracleMock = {
      createRequest: { staticCall: createRequestStub.resolves(createRequestResult) },
      ['proposeResponse(bytes32,bytes)']: { staticCall: proposeResponseStub.resolves(proposeResponseResult) },
      disputeResponse: { staticCall: disputeResponseStub.resolves(disputeResponseResult) },
      createRequests: { staticCall: createRequestsStub.resolves(createRequestsResult) },
      escalateDispute: { staticCall: escalationDisputeStub.resolves(escalationDisputeResult) },
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
      expect(escalationDisputeStub.calledWith(sampleBytes32)).to.be.true;
      expect(result).to.equal(escalationDisputeResult);
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
});
