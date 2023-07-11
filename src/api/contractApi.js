import { Contract } from 'ethers';

export function createContractApi(
  contractAddress,
  abi,
  provider
) {

  const signer = provider.getSigner();
  const contract = new Contract(contractAddress, abi, signer);

  const query = async (methodName, ...args) => {
    return await contract[methodName](...args);
  };

  const sendTransaction = async (methodName, ...args) => {
    const tx = await contract[methodName](...args);
    return tx.wait();
  };

  const getContract = () => {
    return contract;
  }

  const events = async (eventName, fromBlock, toBlock, ...args) => {
    const filter = contract.filters[eventName](...args);
    return contract.queryFilter(filter, fromBlock, toBlock);
  };

  return {
    query,
    sendTransaction,
    getContract,
    events
  };
}