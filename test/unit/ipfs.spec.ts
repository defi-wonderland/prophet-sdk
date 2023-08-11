import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import { Ipfs } from '../../src/ipfs/ipfs';
import { IpfsApi } from '../../src/ipfsApi';
import { cidToBytes32 } from '../../src/utils/cid';

describe('ipfs', () => {
  let ipfs: Ipfs;

  const cid = 'QmUKGQzaaM6Gb1c6Re83QXV4WgFqf2J71S7mtUpbsiHpkt';
  const cidBytes32 = cidToBytes32(cid);

  const getRequestMetadataResult = {
    responseType: 'int256',
    description: 'test',
    returnedTypes: {
      '0x123': {
        '0x456': { '0x789': ['int256', 'int256'] },
      },
    },
  };

  const getMetadataStub: SinonStub = sinon.stub();

  beforeEach(async () => {
    const ipfsApi = {
      getMetadata: getMetadataStub.resolves(getRequestMetadataResult),
    };

    ipfs = new Ipfs(ipfsApi as any as IpfsApi);
  });

  describe('getResponseType', () => {
    it('call to getRequest and getMetadata', async () => {
      const result = await ipfs.getResponseType(cidBytes32);
      expect(getMetadataStub.calledWith(cid)).to.be.true;
      expect(result).to.equal(getRequestMetadataResult.responseType);
    });
  });

  describe('getReturnedTypes', () => {
    it('call to getMetadata', async () => {
      const result = await ipfs.getReturnedTypes(cidBytes32);
      expect(getMetadataStub.calledWith(cid)).to.be.true;
      expect(result).to.equal(getRequestMetadataResult.returnedTypes);
    });
  });
});
