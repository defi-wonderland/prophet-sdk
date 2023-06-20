import { expect } from "chai";
import {
  cidToBytes32,
  bytes32ToCid,
  isIpfsUri,
  isIpfsCID,
} from "../../../src/utils/cid";

import { encode, decode } from "bs58";
describe("Cid", () => {
  describe("cidToBytes32", () => {
    const cid = "QmABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstu";
    it("should convert IPFS CID to bytes32 string", () => {
      // Arrange
      const expectedBytes32 = "0x" + decode(cid).slice(2).toString("hex");

      // Act
      const result = cidToBytes32(cid);

      // Assert
      expect(result).to.equal(expectedBytes32);
    });

    it("should handle different input CID formats", () => {
      // Arrange    QmR2eQeEjLQNUjLyovFyvhX6mF7h9bY7hnLb9C4noW1Grd
      const anotherCid = "bafyABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstu";
      const expected1Bytes32 = "0x" + decode(cid).slice(2).toString("hex");
      const expected2Bytes32 =
        "0x" + decode(anotherCid).slice(2).toString("hex");

      // Act
      const result1 = cidToBytes32(cid);
      const result2 = cidToBytes32(anotherCid);

      // Assert
      expect(result1).to.equal(expected1Bytes32);
      expect(result2).to.equal(expected2Bytes32);
    });

    it("should return bytes32 string with correct length", () => {
      // Arrange
      const expectedBytes32Length = 66; // 32 bytes (64 characters) + "0x" (2 characters)

      // Act
      const result = cidToBytes32(cid);

      // Assert
      expect(result).to.be.a("string");
      expect(result.length).to.equal(expectedBytes32Length);
    });
  });

  describe("bytes32ToCid", () => {
    it("should convert bytes32 to IPFS CID", () => {
      // Arrange
      const bytes32 =
        "0x4b47917f1b61e5395a767c7a9427aa695f5568cf7a7f259b92f468f8fcc4fbd2"; // Bytes32 QmABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
      const hashHex = "1220" + bytes32.slice(2);
      const expectedCid = encode(Buffer.from(hashHex, "hex"));

      // Act
      const result = bytes32ToCid(bytes32);

      // Assert
      expect(result).to.equal(expectedCid);
    });
  });

  describe("isIpfsCID", () => {
    it("should return true for valid IPFS CIDs", () => {
      // Arrange
      const validCIDs = [
        "QmABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstu",
        "bafyabcdefg1234567890",
        "bafkabcdefg1234567890",
      ];

      // Act & Assert
      for (const cid of validCIDs) {
        expect(isIpfsCID(cid)).to.be.true;
      }
    });

    it("should return false for invalid IPFS CIDs", () => {
      // Arrange
      const invalidCIDs = [
        "QrABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstu", // Qr
        "bafr0123456789", // bafr
        "bafqabcdefghi", // bafq
      ];

      // Act & Assert
      for (const cid of invalidCIDs) {
        expect(isIpfsCID(cid)).to.be.false;
      }
    });
  });

  describe("isIpfsUri", () => {
    it("should return true for valid IPFS URIs", () => {
      // Arrange
      const validURIs = [
        "ipfs://QmABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstu",
        "ipfs://bafyabcdefg1234567890",
        "ipfs://bafkabcdefg1234567890",
      ];

      // Act & Assert
      for (const uri of validURIs) {
        expect(isIpfsUri(uri)).to.be.true;
      }
    });

    it("should return false for invalid IPFS URIs", () => {
      // Arrange
      const invalidURIs = [
        "https://example.com", // Not an IPFS URI
        "ipfs://", // Missing CID
        "ipfs://qrte1234567890", // Empty URI
      ];

      // Act & Assert
      for (const uri of invalidURIs) {
        expect(isIpfsUri(uri)).to.be.false;
      }
    });
  });
});
