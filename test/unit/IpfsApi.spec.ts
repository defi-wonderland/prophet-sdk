import { expect } from 'chai';
import { IpfsApi } from '../../src/ipfsApi';
import { cidToBytes32 } from '../../src/utils/cid';
import config from '../../src/config/config';
import sinon from 'sinon';

describe('Ipfssdk', () => {
    let ipfsApi: IpfsApi;
    let pinFileToIPFSStub: sinon.SinonStub;
    const cid = 'QmUKGQzaaM6Gb1c6Re83QXV4WgFqf2J71S7mtUpbsiHpkt';
    const cidBytes32 = cidToBytes32(cid);

    const metadata = {
        responseType: "application/json",
        description: "Greetings, from typescript"
    }

    beforeEach(async () => {
        ipfsApi = new IpfsApi(config.PINATA_API_KEY, config.PINATA_SECRET_API_KEY);

        // mocking pinata returns
        pinFileToIPFSStub = sinon.stub(ipfsApi.api, 'pinJSONToIPFS');
        pinFileToIPFSStub.withArgs(metadata).resolves({ IpfsHash: cid });
    });

    describe('uploadMetadata', () => {
        it('call to pinJSONToIPFS pinata sdk method', async () => {
            const result = await ipfsApi.uploadMetadata(metadata);
            expect(pinFileToIPFSStub.calledWith(metadata)).to.be.true;
        });


        it('should correctly upload metadata', async () => {
            const result = await ipfsApi.uploadMetadata(metadata);
            expect(result).to.equal(cidBytes32);
        });
    });
});
