import { expect } from 'chai';
import sinon from 'sinon';
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
    

    const createRequestStub: sinon.SinonStub = sinon.stub();
    const getRequestStub: sinon.SinonStub = sinon.stub();
    const proposeResponseStub: sinon.SinonStub = sinon.stub();
    const getResponseStub: sinon.SinonStub = sinon.stub();
    const uploadMetadataStub: sinon.SinonStub = sinon.stub();
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
            proposeResponse: proposeResponseStub.resolves(proposeResponseResult),
            getResponse: getResponseStub.resolves(getResponseResult),
        };

        const mockIpfsApi = {
            uploadMetadata: uploadMetadataStub.resolves({ cidBytes32 })
        };

        helpers = new Helpers(oracleMock as IOracle, mockIpfsApi as IpfsApi);
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

    describe('getResponse', () => {
        it('call to getResponse', async () => {
            const result = await helpers.getResponse('1');
            expect(getResponseStub.calledWith('1')).to.be.true;
            expect(result).to.equal(getResponseResult);
        });
    });
});
