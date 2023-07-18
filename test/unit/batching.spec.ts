import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import { IOracle } from '../../src/types/typechain';
import { Batching } from '../../src/batching';

describe('Batching', () => {
    let batching: Batching;

    const getResponseIdsResult = ['responseId1', 'responseId2'];
    const getResponseResult = 'response';

    const getResponseStub: SinonStub = sinon.stub();
    const getResponseIdsStub: sinon.SinonStub = sinon.stub();

    beforeEach(async () => {
        const oracleMock = {
            getResponseIds: getResponseIdsStub.resolves(getResponseIdsResult),
            getResponse: getResponseStub.resolves(getResponseResult),
        };

        batching = new Batching(oracleMock as IOracle);
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
