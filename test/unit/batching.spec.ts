import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import { IOracle } from '../../src/types/typechain';
import { Batching } from '../../src/batching';

describe('Batching', () => {
    let batching: Batching;

    const listRequestsResult = ['request2', 'request2'];
    const getResponseIdsResult = ['responseId1', 'responseId2'];
    const getFinalizedResponseResult = 'finalizedResponse';
    const getResponseResult = 'response';

    const listRequestStub: SinonStub = sinon.stub();
    const getResponseIdsStub: SinonStub = sinon.stub();
    const getFinalizedResponseStub: SinonStub = sinon.stub();
    const getResponseStub: SinonStub = sinon.stub();
   
    beforeEach(async () => {
        const oracleMock = {
            listRequests: listRequestStub.resolves(listRequestsResult),
            getResponseIds: getResponseIdsStub.resolves(getResponseIdsResult),
            getFinalizedResponse: getFinalizedResponseStub.resolves(getFinalizedResponseResult),
            getResponse: getResponseStub.resolves(getResponseResult),
        };

        batching = new Batching(oracleMock as IOracle);
    });

    describe('listRequests', () => {
        it('call to listRequests', async () => {
            const result = await batching.listRequests(0, 10);
            expect(listRequestStub.calledWith(0, 10)).to.be.true;
            expect(result).to.be.equal(listRequestsResult);
        });
    });

    describe('getResponseIds', () => {
        it('call to getResponseIds', async () => {
            const result = await batching.getResponseIds('1');
            expect(getResponseIdsStub.calledWith('1')).to.be.true;
            expect(result).to.be.equal(getResponseIdsResult);
        });
    });

    describe('getFinalizedResponse', () => {
        it('call to getFinalizedResponse', async () => {
            const result = await batching.getFinalizedResponse('1');
            expect(getFinalizedResponseStub.calledWith('1')).to.be.true;
            expect(result).to.be.equal(getFinalizedResponseResult);
        });
    });

    describe('listResponses', () => {
        it('call to getResponseIds', async () => {
            const result = await batching.listResponses('1');
            expect(getResponseIdsStub.calledWith('1')).to.be.true;
            expect(result.length).to.be.equal(2);
            expect(result[0]).to.be.equal(getResponseResult);
            expect(result[1]).to.be.equal(getResponseResult);
        });
    });
});
