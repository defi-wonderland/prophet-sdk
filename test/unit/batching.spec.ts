import { Batching } from '../../src/batching';
import { IOracle } from '../../src/types/typechain';
import { ethers } from 'ethers';
import config from '../../src/config/config';
import { abi as IAbiOracle } from '@defi-wonderland/prophet-core-abi/abi/IOracle.json';
import { expect } from 'chai';
import { address } from '../constants';
import { Helpers } from '../../src/helpers';

describe('Batching', () => {
  const provider = new ethers.JsonRpcProvider(config.RPC_URL);

  const oracle = new ethers.Contract(address.deployed.ORACLE, IAbiOracle, provider) as unknown as IOracle;

  const helpers = new Helpers(oracle, {} as any, {} as any);

  const batching = new Batching(oracle, helpers);

  it('should return the correct requestId for full request data', async () => {
    const result = await batching.listRequests(10, 6);

    expect(result[0].requestWithId.requestId).to.equal(
      '0x346329bee294d95bc868a025646651867e2e6262d0ddbe2e3b36557494040b99'
    );
    expect(result[1].requestWithId.requestId).to.equal(
      '0xaca3060bf6b99e096eb914186721559dd3fe343adee938625e6192536fb6eaa9'
    );
    expect(result[2].requestWithId.requestId).to.equal(
      '0x8dbdf79925e7fbfefb8398430d267d12406c59b3c37a4de5cd2f3989f6d2b5b2'
    );
    expect(result[3].requestWithId.requestId).to.equal(
      '0x74d05937a1f5e2cecefa0848d494ec982883f23ef6b696c1e5cc614e0f46d00b'
    );
    expect(result[4].requestWithId.requestId).to.equal(
      '0xd42c364090285bd38ad05f4f252cb4abd54c4176dceaf4e60bd4cb387287f895'
    );
  });

  it('should return the correct requestId and response for response data', async () => {
    const result = await batching.listResponses('0x346329bee294d95bc868a025646651867e2e6262d0ddbe2e3b36557494040b99');

    const expectedFirstRowResult = {
      requestId: '0x346329bee294d95bc868a025646651867e2e6262d0ddbe2e3b36557494040b99',
      responseId: '0x5cbffa6ede43c835518c98c5c1b8f040a817c824d3da6db79ecc6d788e5f809f',
      response: [
        '0x102EEA73631BaB024C55540B048FEA1e43271962',
        '0x346329bee294d95bc868a025646651867e2e6262d0ddbe2e3b36557494040b99',
        '0x0000000000000000000000000000000000000000000000000000000000000001',
      ],
      blockNumber: BigInt(111060518),
    };

    expect(result[0]).to.deep.equal(expectedFirstRowResult);
  });

  it('should return the correct disputes for listDisputes', async () => {
    const expectedFirstRowResult = [
      '0x92beec1f9d484cc8e13bed2473cbcb3869ec427dea4375c243589258646e6154',
      false,
      [
        [
          '0x24308546202aa6d44d2acd58609a7631f8815297f8986dd7cbe41d3e6acb6743',
          BigInt(111060540),
          '0xbea40f0c42f70c41f7dd7f5ae42f73137df596c61fdd4e3d52ad971de8ad05b9',
          BigInt(84),
        ],
      ],
    ];
    const result = await batching.listDisputes(21, 5);

    expect(result[0]).to.deep.equal(expectedFirstRowResult);
  });
});
