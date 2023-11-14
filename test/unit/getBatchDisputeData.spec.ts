import { getBatchDisputeData } from '../../src/batching/getBatchDisputeData';
import { expect } from 'chai';
import config from '../../src/config/config';
import { ethers } from 'ethers';
/*
describe('getBatchDisputeData', () => {
  const provider = new ethers.JsonRpcProvider(config.RPC_URL);

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

  it('returns the correct dispute', async () => {
    const result = await getBatchDisputeData(provider, '0xC7F52019DfE600993c8088383668eFf1FBa4473a', 170, 1);

    expect(result[0]).to.deep.equal(firstRow);
  });

  it('returns the correct value for a finalized and non finalized request', async () => {
    const result = await getBatchDisputeData(provider, '0xC7F52019DfE600993c8088383668eFf1FBa4473a', 282, 3);

    expect(result[0].isFinalized).to.equal(true);
    expect(result[2].isFinalized).to.equal(false);
  });
});
*/
