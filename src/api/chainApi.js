import { ethers } from 'ethers';

export default class chainApi {
  provider;

  constructor(provider) {
    this.provider = provider;
  }

  async transfer(address,value) {
    const signer = this.provider.getSigner();  
    return await signer.sendTransaction({
			to: address,
			value: ethers.utils.parseEther(value),
    })
    
  }

  async getBalance(address) {
    let balance = await this.provider.getBalance(address);
    return new Promise((resolve) => {
      resolve(ethers.utils.formatEther(balance));
    });
  }
}