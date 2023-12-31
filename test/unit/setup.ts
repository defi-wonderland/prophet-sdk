/* External Imports */
import 'dotenv/config';
import chai from 'chai';
import Mocha from 'mocha';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const should = chai.should();
const expect = chai.expect;

export { should, expect, Mocha };
