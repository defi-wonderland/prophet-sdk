/**
 * Includes functions to convert between IPFS CID (Base58), and a 32 bytes hex string
 */

import { encode, decode } from 'bs58';
import { Buffer } from 'buffer';
import { BytesLike } from 'ethers';

/**
 * Converts IPFS content identifier address string to 32 byte hex
 * Assume IPFS defaults: function:0x12=sha2, size:0x20=256 bits
 * @param cid - The 46 character long IPFS CID string
 * @returns bytes32 string
 */
export const cidToBytes32 = (cid: string): string => {
  return '0x' + decode(cid).slice(2).toString('hex');
};

/**
 * Converts 32 byte hex string (initial 0x is removed) to Base58 IPFS content identifier address string
 * @param bytes32 - The 32 byte long hex string to encode to IPFS CID (without initial 0x).
 * @dev Works correctly with CID version 0
 * @returns CID string
 */
export const bytes32ToCid = (bytes32: BytesLike): string => {
  // Add our default ipfs values for first 2 bytes:
  // function:0x12=sha2, size:0x20=256 bits
  // and cut off leading "0x"
  const hashHex = '1220' + bytes32.slice(2);
  return encode(Buffer.from(hashHex, 'hex'));
};

/**
 * Determines if a string is a valid IPFS url
 * @param url - The url to check
 * @returns true if the url is a valid IPFS url
 */
export const isIpfsUri = (url: string): boolean => {
  const cid = url.split('://')[1];
  return url.startsWith('ipfs://') && isIpfsCID(cid);
};

/**
 * Determines if a string is a valid IPFS CID
 * @param cid - The CID to check
 * @returns true if the string is a valid IPFS CID
 */
export const isIpfsCID = (cid: string): boolean => {
  return cid.startsWith('Qm') || cid.startsWith('bafy') || cid.startsWith('bafk');
};
