import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import { Helpers } from '../../src/helpers';
import { IOracle } from '../../src/types/typechain';
import { IpfsApi } from '../../src/ipfsApi';
import { cidToBytes32 } from '../../src/utils/cid';

describe('Helpers', () => {
    let helpers: Helpers;

    const createRequestResult = 'success';
    const getRequestResult = 'getRequestResult';
    const proposeResponseResult = 'proposeResponseResult';
    const getResponseResult = 'getResponseResult';
    const getResponseIdsResult = ['responseId1', 'responseId2'];
    const getFinalizedResponseResult = 'finalizedResponse';
    const listRequestsResult = ['request2', 'request2'];
    
    const createRequestStub: SinonStub = sinon.stub();
    const getRequestStub: SinonStub = sinon.stub();
    const proposeResponseStub: SinonStub = sinon.stub();
    const getResponseStub: SinonStub = sinon.stub();
    const uploadMetadataStub: SinonStub = sinon.stub();
    const getResponseIdsStub: SinonStub = sinon.stub();
    const getFinalizedResponseStub: SinonStub = sinon.stub();
    const listRequestStub: SinonStub = sinon.stub();

    const cid = 'QmUKGQzaaM6Gb1c6Re83QXV4WgFqf2J71S7mtUpbsiHpkt';
    const cidBytes32 = cidToBytes32(cid);
    

    let sampleRequest = {
        requestModuleData: '',
        responseModuleData: '',
        disputeModuleData: '',
        resolutionModuleData: '',
        finalityModuleData: '',
        ipfsHash: '',
        requestModule: '',
        responseModule: '',
        disputeModule: '',
        resolutionModule: '',
        finalityModule: '',
        requester: '',
        nonce: '',
        createdAt: ''
    };

    let sampleRequestMetadata = {
        responseType: '',
        description: ''
    };

    beforeEach(async () => {
        const oracleMock = {
            createRequest: createRequestStub.resolves(createRequestResult),
            getRequest: getRequestStub.resolves(getRequestResult),
            ['proposeResponse(bytes32,bytes)']: proposeResponseStub.resolves(proposeResponseResult),
            ['proposeResponse(address,bytes32,bytes)']: proposeResponseStub.resolves(proposeResponseResult),
            getResponse: getResponseStub.resolves(getResponseResult),
            getResponseIds: getResponseIdsStub.resolves(getResponseIdsResult),
            getFinalizedResponse: getFinalizedResponseStub.resolves(getFinalizedResponseResult),
            listRequests: listRequestStub.resolves(listRequestsResult),
        };

        const mockIpfsApi = {
            uploadMetadata: uploadMetadataStub.resolves({ cidBytes32 })
        };

        helpers = new Helpers(oracleMock as unknown as IOracle, mockIpfsApi as IpfsApi);
    });

    describe('createRequest', () => {
        it('call to createRequest', async () => {
            const result = await helpers.createRequest(sampleRequest);
            expect(result).to.equal(createRequestResult);
            expect(createRequestStub.calledWith(sampleRequest)).to.be.true;
        });
    });

    describe('createRequestWithMetadata', () => {
        it('call to createRequestWithMetadata', async () => {
            const result = await helpers.createRequestWithMetadata(sampleRequest, sampleRequestMetadata);
            expect(uploadMetadataStub.calledWith(sampleRequestMetadata)).to.be.true;
            expect(createRequestStub.calledWith(sampleRequest)).to.be.true;
            expect(result).to.equal(createRequestResult);
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

    describe('proposeResponseWithProposer', () => {
        it('call to proposeResponse', async () => {
            const result = await helpers.proposeResponseWithProposer('0x123', '1', 'responseData');
            expect(proposeResponseStub.calledWith('0x123', '1', 'responseData')).to.be.true;
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
});
