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
    const result = await batching.listRequests(0, 4);
    expect(result[0].requestId).to.equal('0xd2c0f03c5e0907822f7b5fddbffe9c50173697cb0f26310e691171800c6898cb');
  });

  it('should return the correct requestId for response data', async () => {
    const result = await batching.listResponses('0x0e0ee666b35a92eda23f750ec6be6f3108b9fd5b34cee8bffaff99f474fa9de9');

    expect(result[0].requestId).to.equal('0x0e0ee666b35a92eda23f750ec6be6f3108b9fd5b34cee8bffaff99f474fa9de9');
  });

  it('should return the correct disputes for listDistputes', async () => {
    let batching = new Batching(
      new ethers.Contract('0xC7F52019DfE600993c8088383668eFf1FBa4473a', IAbiOracle, provider) as unknown as IOracle
    );

    const firstRow = [
      '0x0174efcd0cffdbac6f2b5f9a788c5bd138d33c7473cc74f717514384c8dfe281',
      false,
      [
        [
          '0x7faa2e94adb102d73afe052a767e114c67100b0fc9edf5367fd53cba76306d3c',
          BigInt(1693355482),
          '0x1498A6996b39e0a8265A4C8448DB731d5BF84032',
          '0x1498A6996b39e0a8265A4C8448DB731d5BF84032',
          '0xc1d75a11e28d3ab4f5e32f84a45eae194f35f28b1482e6d6f55ba82318965e32',
          '0x0174efcd0cffdbac6f2b5f9a788c5bd138d33c7473cc74f717514384c8dfe281',
          BigInt(1),
        ],
      ],
    ];
    const result = await batching.listDisputes(170, 1);

    expect(result[0]).to.deep.equal(firstRow);
  });
});
