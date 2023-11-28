import { getBatchDisputeData } from '../../src/batching/getBatchDisputeData';
import { expect } from 'chai';
import config from '../../src/config/config';
import { ethers } from 'ethers';
import { address } from '../constants';

describe('getBatchDisputeData', () => {
  const provider = new ethers.JsonRpcProvider(config.RPC_URL);

  const firstRow = [
    '0x92beec1f9d484cc8e13bed2473cbcb3869ec427dea4375c243589258646e6154',
    BigInt(111060538),
    false,
    [
      [
        '0x24308546202aa6d44d2acd58609a7631f8815297f8986dd7cbe41d3e6acb6743',
        '0xbea40f0c42f70c41f7dd7f5ae42f73137df596c61fdd4e3d52ad971de8ad05b9',
        BigInt(111060540),
        BigInt(111060539),
        BigInt(1),
      ],
    ],
  ];

  it('returns the correct dispute', async () => {
    const result = await getBatchDisputeData(provider, address.deployed.ORACLE, 21, 4);

    expect(result[0]).to.deep.equal(firstRow);
  });

  it('returns the correct value for a non finalized request', async () => {
    const result = await getBatchDisputeData(provider, address.deployed.ORACLE, 21, 4);

    expect(result[0].isFinalized).to.equal(false);
  });
});
