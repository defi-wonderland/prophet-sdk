import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import { Helpers } from '../../src/helpers';
import { IOracle } from '../../src/types/typechain';
import { IpfsApi } from '../../src/ipfsApi';
import { cidToBytes32 } from '../../src/utils/cid';
import { BytesLike, ethers, providers } from 'ethers';
import config from '../../src/config/config';
import { RequestMetadata } from '../../src/types/typeoffchain/typeoffchain';

describe('Helpers', () => {
    let helpers: Helpers;

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

    const cid = 'QmUKGQzaaM6Gb1c6Re83QXV4WgFqf2J71S7mtUpbsiHpkt';
    const cidBytes32 = cidToBytes32(cid);
    
    const sampleBytes32 = '0xb4ff0acb4895c1b00daf9ec45a04d4d0192d5d0000de47e266767a8e20ea5fd8'

    let sampleRequest = {
        requestModuleData: ethers.utils.formatBytes32String('requestModuleData'),
        responseModuleData: ethers.utils.formatBytes32String('responseModuleData'),
        disputeModuleData: ethers.utils.formatBytes32String('disputeModuleData'),
        resolutionModuleData: ethers.utils.formatBytes32String('resolutionModuleData'),
        finalityModuleData: ethers.utils.formatBytes32String('finalityModuleData'),
        ipfsHash: ethers.utils.formatBytes32String('ipfsHash'),
        requestModule: '0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A',
        responseModule: '0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A',
        disputeModule: '0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A',
        resolutionModule: '0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A',
        finalityModule: '0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A'
    };

    let sampleRequestMetadata = {
        responseType: 'uint',
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
            disputeResponse: disputeResponseStub.resolves(disputeResponseResult),
            createRequests: createRequestsStub.resolves(createRequestsResult),
            validModule: validModuleStub.resolves(validModuleResult),
            getDispute: getDisputeStub.resolves(getDisputeResult),
            getFullRequest: getFullRequestStub.resolves(getFullRequestResult),
            disputeOf: disputeOfStub.resolves(disputeOfResult),
            escalateDispute: escalationDisputeStub.resolves(escalationDisputeResult),
            resolveDispute: resolveDisputeStub.resolves(resolveDisputeResult),
            listRequestIds: listRequestIdsStub.resolves(listRequestIdsResult),
            finalize: finalizeStub.resolves(finalizeResult)
        };

        const mockIpfsApi = {
            uploadMetadata: uploadMetadataStub.resolves(cidBytes32)
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

        it('throws error if invalid response type', async () => {
            const invalidRequestMetadata = {
                responseType: 'uint7',
                description: ''
            };

            try {
                await helpers.createRequest(sampleRequest, invalidRequestMetadata);
            } catch (e) {
                expect(e.message).to.equal('Invalid response type: uint7');
            }
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

    // TODO: Not available because is not implemented yet in the oracle contract, uncomment when it is implemented
    /*
    describe('createRequests', () => {
        it('call to createRequests', async () => {
            const encodedRequest = getEncodedFunctionData([sampleRequest], [sampleRequestMetadata]);
            const result = await helpers.createRequests([sampleRequest], [sampleRequestMetadata]);
            expect(uploadMetadataStub.calledWith(sampleRequestMetadata)).to.be.true;
            expect(createRequestsStub.calledWith(encodedRequest)).to.be.true;
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
    */

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
            const result = await helpers.finalize(sampleBytes32, '0xc5ff0acb4895c1b00daf9ec45a04d4d0192d5d0000de47e266767a8e20ea5fd7');
            expect(finalizeStub.calledWith(sampleBytes32, '0xc5ff0acb4895c1b00daf9ec45a04d4d0192d5d0000de47e266767a8e20ea5fd7')).to.be.true;
            expect(result).to.equal(finalizeResult);
        });
    });
});

const getEncodedFunctionData = (requests: IOracle.NewRequestStruct[], requestMetadata: RequestMetadata[]) => {
    const abiCoder = new ethers.utils.AbiCoder();
    
    const cid = 'QmUKGQzaaM6Gb1c6Re83QXV4WgFqf2J71S7mtUpbsiHpkt';
    const cidBytes32 = cidToBytes32(cid);

    let requestsData : BytesLike[] = [];
    for (let i = 0; i < requests.length; i++) {
        const request = requests[i];
        request.ipfsHash = cidBytes32;
        requestsData.push(abiCoder.encode([
            'bytes',
            'bytes',
            'bytes',
            'bytes',
            'bytes',
            'bytes32',
            'address',
            'address',
            'address',
            'address',
            'address',
        ],
        [
            request.requestModuleData,
            request.responseModuleData,
            request.disputeModuleData,
            request.resolutionModuleData,
            request.finalityModuleData,
            request.ipfsHash,
            request.requestModule,
            request.responseModule,
            request.disputeModule,
            request.resolutionModule,
            request.finalityModule,
        ]));
    }

    return requestsData;
}

