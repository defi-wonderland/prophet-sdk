import { getBatchRequestData } from '../../src/batching/getBatchRequestData';
import { expect } from 'chai';
import config from '../../src/config/config';
import { providers } from 'ethers';


describe('getBatchRequestData', () => {
    const provider = new providers.JsonRpcProvider(config.TENDERLY_URL);
    it('returns the correct requestId', async () => {
        const result = await getBatchRequestData(provider, '0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A', 0, 5);

        expect(result[0].requestId).to.equal('0xd2c0f03c5e0907822f7b5fddbffe9c50173697cb0f26310e691171800c6898cb');
    });
});
