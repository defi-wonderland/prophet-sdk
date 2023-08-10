import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import { Ipfs } from '../../src/ipfs/ipfs';
import { IOracle } from '../../src/types/typechain';
import { IpfsApi } from '../../src/ipfsApi';
import { cidToBytes32 } from '../../src/utils/cid';

describe('ipfs', () => {
  let ipfs: Ipfs;

  const cid = 'QmUKGQzaaM6Gb1c6Re83QXV4WgFqf2J71S7mtUpbsiHpkt';
  const cidBytes32 = cidToBytes32(cid);

  const getRequestResult = { ipfsHash: cidBytes32 };
  const getRequestMetadataResult = {
    responseType: 'int256',
    description: 'test',
    returnedTypes: {
      '0x123': {
        '0x456': { '0x789': ['int256', 'int256'] },
      },
    },
  };

  const getRequestStub: SinonStub = sinon.stub();
  const getMetadataStub: SinonStub = sinon.stub();

  const sampleRequestId = '0xc5ff0acb4895c1b00daf9ec45a04d4d0192d5d0000de47e266767a8e20ea5fd7';

  beforeEach(async () => {
    const ipfsApi = {
      getMetadata: getMetadataStub.resolves(getRequestMetadataResult),
    };

    const oracleMock = {
      getRequest: getRequestStub.resolves(getRequestResult),
    };

    ipfs = new Ipfs(oracleMock as any as IOracle, ipfsApi as any as IpfsApi);
  });

  describe('getResponseType', () => {
    it('call to getRequest and getMetadata', async () => {
      const result = await ipfs.getResponseType(sampleRequestId);
      expect(getRequestStub.calledWith(sampleRequestId)).to.be.true;
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
