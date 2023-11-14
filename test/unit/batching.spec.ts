import { Batching } from '../../src/batching';
import { IOracle } from '../../src/types/typechain';
import { ethers } from 'ethers';
import config from '../../src/config/config';
import { abi as IAbiOracle } from '@defi-wonderland/prophet-core-abi/abi/IOracle.json';
import { expect } from 'chai';
import { address } from './utils/constants';

/*
describe('Batching', () => {
  const provider = new ethers.JsonRpcProvider(config.RPC_URL);

  let batching = new Batching(new ethers.Contract(address.deployed.ORACLE, IAbiOracle, provider) as unknown as IOracle);

  it('should return the correct requestId for full request data', async () => {
    const result = await batching.listRequests(10, 1);
    expect(result[0].requestId).to.equal('0xbda69502828fcd5b0b95d851ee5405efd2b2be720ce546efa55f79b4d9f6da68');
  });

  it('should return the correct requestId and response for response data', async () => {
    const result = await batching.listResponses('0xe8f672fab56b23a24f3c53931df60919aabf219acffaab005a304a0a4c547bb6');

    expect(result[0].requestId).to.equal('0xe8f672fab56b23a24f3c53931df60919aabf219acffaab005a304a0a4c547bb6');
    expect(result[0].response).to.equal('0x000000000000000000000000d7ccc603a29fc9af6b25bae13b434e2f66f556aa');
  });

  it('should return the correct disputes for listDistputes', async () => {
    const firstRow = [
      '0xe8f672fab56b23a24f3c53931df60919aabf219acffaab005a304a0a4c547bb6',
      false,
      [
        [
          '0x731870a7eb093e72fe631e1d8c5ad9b27401676b226de972f0f6f6cc9ede58a2',
          BigInt(1696362028),
          '0x1498A6996b39e0a8265A4C8448DB731d5BF84032',
          '0x1498A6996b39e0a8265A4C8448DB731d5BF84032',
          '0x021cf7eec2968a198c2d08635619760ae4894fd852f26f0080ef1780d9f502b0',
          '0xe8f672fab56b23a24f3c53931df60919aabf219acffaab005a304a0a4c547bb6',
          BigInt(1),
        ],
      ],
    ];
    const result = await batching.listDisputes(42, 6);

    expect(result[0]).to.deep.equal(firstRow);
  });
});
*/
