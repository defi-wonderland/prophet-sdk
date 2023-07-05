import { expect } from 'chai';
import { providers } from 'ethers';
import { OpooSDK } from '../../src/oracle';
import sinon from 'sinon';

describe('Batching', () => {
    let listRequestsStub: sinon.SinonStub;
    let provider = new providers.JsonRpcProvider(process.env.TENDERLY_URL);
    let sdk = new OpooSDK(provider);
    listRequestsStub = sinon.stub(sdk.batching, 'listRequests');

    describe('listRequests', () => {
        it('call to listRequests', async () => {
            const result = await sdk.batching.listRequests(0, 10);
            expect(listRequestsStub.calledWith(0, 10)).to.be.true;
        });
    });
});
