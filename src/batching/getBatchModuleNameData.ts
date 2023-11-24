import { bytecode } from '@defi-wonderland/prophet-batching-abi/abi/BatchModuleNameData.json';
import { AbiCoder, AddressLike, ContractRunner } from 'ethers';

/**
 * Gets the module names requested for an array of modules addresses
 * @param provider - the RPC provider
 * @param moduleAddresses - module addresses to get the names for
 * @returns the module names requested
 */
export const getBatchModuleNameData = async (provider: ContractRunner, modules: AddressLike[]): Promise<string[]> => {
  const inputData = AbiCoder.defaultAbiCoder().encode(['address[]'], [modules]);

  const contractCreationCode = bytecode.concat(inputData.slice(2));
  const returnedData = await provider.call({ data: contractCreationCode });
  const decodedData = AbiCoder.defaultAbiCoder().decode(['string[]'], returnedData);

  return decodedData[0] as string[];
};
