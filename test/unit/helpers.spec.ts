import { expect } from 'chai';
import { providers } from 'ethers';
import { OpooSDK } from '../../src/oracle';
import sinon from 'sinon';

describe('Helpers', () => {
    let createRequestStub: sinon.SinonStub;
    let createRequestWithMetadataStub: sinon.SinonStub;
    let getRequestStub: sinon.SinonStub;
    let proposeResponseStub: sinon.SinonStub;
    let provider = new providers.JsonRpcProvider(process.env.TENDERLY_URL);
    let sdk = new OpooSDK(provider);
    createRequestStub = sinon.stub(sdk.helpers, 'createRequest');
    createRequestWithMetadataStub = sinon.stub(sdk.helpers, 'createRequestWithMetadata');
    getRequestStub = sinon.stub(sdk.helpers, 'getRequest');
    proposeResponseStub = sinon.stub(sdk.helpers, 'proposeResponse');

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

    describe('createRequest', () => {
        it('call to createRequest', async () => {
            const result = await sdk.helpers.createRequest(sampleRequest);
            expect(createRequestStub.calledWith(sampleRequest)).to.be.true;
        });
    });

    describe('createRequestWithMetadata', () => {
        it('call to createRequestWithMetadata', async () => {
            const result = await sdk.helpers.createRequestWithMetadata(sampleRequest, sampleRequestMetadata);
            expect(createRequestWithMetadataStub.calledWith(sampleRequest, sampleRequestMetadata)).to.be.true;
        });
    });

    describe('getRequest', () => {
        it('call to getRequest', async () => {
            const result = await sdk.helpers.getRequest('1');
            expect(getRequestStub.calledWith('1')).to.be.true;
        });
    });

    describe('proposeResponse', () => {
        it('call to proposeResponse', async () => {
            const result = await sdk.helpers.proposeResponse('1', 'responseData');
            expect(proposeResponseStub.calledWith('1', 'responseData')).to.be.true;
        });
    });
});
