import { Batching } from '../../src/batching';
import { IOracle } from '../../src/types/typechain';
import { ethers } from 'ethers';
import config from '../../src/config/config';
import { abi as IAbiOracle } from 'opoo-core-abi/abi/IOracle.json';
import { expect } from 'chai';

describe('Batching', () => {
  const provider = new ethers.JsonRpcProvider(config.RPC_URL);

  let batching = new Batching(
    new ethers.Contract('0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A', IAbiOracle, provider) as unknown as IOracle
  );

  it('should return the correct requestId for full request data', async () => {
    const result = await batching.getFullRequestData(0, 4);
    expect(result[0].requestId).to.equal('0xd2c0f03c5e0907822f7b5fddbffe9c50173697cb0f26310e691171800c6898cb');
  });

  it('should return the correct requestId for response data', async () => {
    const result = await batching.listResponses('0x0e0ee666b35a92eda23f750ec6be6f3108b9fd5b34cee8bffaff99f474fa9de9');

    expect(result[0].requestId).to.equal('0x0e0ee666b35a92eda23f750ec6be6f3108b9fd5b34cee8bffaff99f474fa9de9');
  });
});
