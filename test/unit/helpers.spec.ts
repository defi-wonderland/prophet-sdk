import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import { Helpers } from '../../src/helpers';
import { IArbitratorModule, IOracle } from '../../src/types/typechain';
import { IpfsApi } from '../../src/ipfsApi';
import { cidToBytes32 } from '../../src/utils/cid';
import { providers } from 'ethers';
import config from '../../src/config/config';
import {abi as IAbiArbitratorModule} from 'opoo-core/abi/IArbitratorModule.json';

describe('Helpers', () => {
    let helpers: Helpers;

    const createRequestResult = 'success';
    const getRequestResult = 'getRequestResult';
    const proposeResponseResult = 'proposeResponseResult';
    const getResponseResult = 'getResponseResult';
    const getResponseIdsResult = ['responseId1', 'responseId2'];
    const getFinalizedResponseResult = 'finalizedResponse';
    const listRequestsResult = ['request2', 'request2'];
    const disputeResponseResult = 'success';
    
    const createRequestStub: SinonStub = sinon.stub();
    const getRequestStub: SinonStub = sinon.stub();
    const proposeResponseStub: SinonStub = sinon.stub();
    const getResponseStub: SinonStub = sinon.stub();
    const uploadMetadataStub: SinonStub = sinon.stub();
    const getResponseIdsStub: SinonStub = sinon.stub();
    const getFinalizedResponseStub: SinonStub = sinon.stub();
    const listRequestStub: SinonStub = sinon.stub();
    const disputeResponseStub: SinonStub = sinon.stub();

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
            disputeResponse: disputeResponseStub.resolves(disputeResponseResult)
        };

        const mockIpfsApi = {
            uploadMetadata: uploadMetadataStub.resolves({ cidBytes32 })
        };

        const provider = new providers.JsonRpcProvider(config.TENDERLY_URL);
        helpers = new Helpers(oracleMock as unknown as IOracle, mockIpfsApi as IpfsApi, provider);
    });

    describe('createRequestWithoutMetadata', () => {
        it('call to createRequest', async () => {
            const result = await helpers.createRequestWithoutMetadata(sampleRequest);
            expect(result).to.equal(createRequestResult);
            expect(createRequestStub.calledWith(sampleRequest)).to.be.true;
        });
    });

    describe('createRequest', () => {
        it('call to createRequestWithMetadata', async () => {
            const result = await helpers.createRequest(sampleRequest, sampleRequestMetadata);
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

    describe('disputeResponse', () => {
        it('call to disputeResponse', async () => {
            const result = await helpers.disputeResponse('1', '2');
            expect(disputeResponseStub.calledWith('1', '2')).to.be.true;
            expect(result).to.be.equal(disputeResponseResult);
        });
    });

    describe('instantiateModule', () => {
        it('returns ArbitratorModule', async () => {
            const result = await helpers.instantiateModule('0x07882Ae1ecB7429a84f1D53048d35c4bB2056877');
            expect(result.moduleClass).to.be.equal('IArbitratorModule');
        });

        it('returns BondedDisputeModule', async () => {
            const result = await helpers.instantiateModule('0x22753E4264FDDc6181dc7cce468904A80a363E44');
            expect(result.moduleClass).to.be.equal('IBondedDisputeModule');
        });

        it('returns BondedResponseModule', async () => {
            const result = await helpers.instantiateModule('0xA7c59f010700930003b33aB25a7a0679C860f29c');
            expect(result.moduleClass).to.be.equal('IBondedResponseModule');
        });

        it('returns BondEscalationModule', async () => {
            const result = await helpers.instantiateModule('0xfaAddC93baf78e89DCf37bA67943E1bE8F37Bb8c');
            expect(result.moduleClass).to.be.equal('IBondEscalationModule');
        });

        /* no bond escalation resolution module deployed
        it('returns BondEscalationResolutionModule', async () => {
            const result = await helpers.instantiateModule('0xab16A69A5a8c12C732e0DEFF4BE56A70bb64c926');
            expect(result.moduleClass).to.be.equal('IBondEscalationResolutionModule');
        });
        */

        it('returns CallbackModule', async () => {
            const result = await helpers.instantiateModule('0x276C216D241856199A83bf27b2286659e5b877D3');
            expect(result.moduleClass).to.be.equal('ICallbackModule');
        });

        it('returns ContractCallRequestModule', async () => {
            const result = await helpers.instantiateModule('0x3155755b79aA083bd953911C92705B7aA82a18F9');
            expect(result.moduleClass).to.be.equal('IContractCallRequestModule');
        });

        it('returns ERC20ResolutionModule', async () => {
            const result = await helpers.instantiateModule('0x5bf5b11053e734690269C6B9D438F8C9d48F528A');
            expect(result.moduleClass).to.be.equal('IERC20ResolutionModule');
        });

        /* fails
        it('returns HttpRequestModule', async () => {
            const result = await helpers.instantiateModule('IHttpRequestModule');
            expect(result.moduleClass).to.be.equal('0x3347B4d90ebe72BeFb30444C9966B2B990aE9FcB');
        });
        */

        it('returns MultipleCallbacksModule', async () => {
            const result = await helpers.instantiateModule('0xffa7CA1AEEEbBc30C874d32C7e22F052BbEa0429');
            expect(result.moduleClass).to.be.equal('IMultipleCallbacksModule');
        });
    });
});
