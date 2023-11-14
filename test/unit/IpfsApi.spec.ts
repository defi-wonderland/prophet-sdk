import { expect } from 'chai';
import sinon from 'sinon';
import { IpfsApi } from '../../src/ipfsApi';
import { cidToBytes32 } from '../../src/utils/cid';
import config from '../../src/config/config';
import { CONSTANTS } from '../../src/utils';

/*
describe('Ipfssdk', () => {
  let ipfsApi: IpfsApi;
  let pinFileToIPFSStub: sinon.SinonStub;
  const cid = 'QmUKGQzaaM6Gb1c6Re83QXV4WgFqf2J71S7mtUpbsiHpkt';
  const cidBytes32 = cidToBytes32(cid);

  const metadata = {
    responseType: 'int256',
    description: 'Integer',
    returnedTypes: {
      '0x123': {
        '0x456': { '0x789': ['int256', 'int256'] },
      },
    },
  };

  const pinataPayload = {
    pinataOptions: {
      cidVersion: CONSTANTS.CID_VERSION,
    },
    pinataMetadata: {
      name: `${metadata.responseType}_${metadata.description}`,
    },
    pinataContent: metadata,
  };

  beforeEach(async () => {
    ipfsApi = new IpfsApi(config.PINATA_API_KEY, config.PINATA_SECRET_API_KEY);

    // mocking pinata returns
    pinFileToIPFSStub = sinon.stub(ipfsApi.api, 'pinJSONToIPFS');
    pinFileToIPFSStub.withArgs(pinataPayload).resolves({ IpfsHash: cid });
  });

  describe('uploadMetadata', () => {
    it('call to pinJSONToIPFS pinata sdk method', async () => {
      const result = await ipfsApi.uploadMetadata(metadata);
      expect(pinFileToIPFSStub.calledWith(pinataPayload)).to.be.true;
    });

    it('should correctly upload metadata', async () => {
      const result = await ipfsApi.uploadMetadata(metadata);
      expect(result).to.equal(cidBytes32);
    });
  });

  describe('getMetadata', () => {
    it('should return metadata cid v0', async () => {
      const result = await ipfsApi.getMetadata('QmU9AyVWBW8QXtSwDjxtGXzgMGeLHQ9XD3ierkhNXreV7s');
      expect(result).to.deep.equal({ responseType: 'uint256', description: 'Unsigned integer' });
    });

    it('should return metadata cid v1', async () => {
      const result = await ipfsApi.getMetadata('bafkreiglmmzhh6fabimxokntzgb62v2cvmytfnazuyceav5nslx5r6jo2e');
      expect(result).to.deep.equal({ responseType: 'int256', description: 'Greetings, from typescript' });
    });
  });
});
*/
