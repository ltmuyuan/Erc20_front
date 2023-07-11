<template>
  <div class="WalletCompinent">
    <a-button type="primary" @click="connectWallet" v-if="!isConnected">Connect wallet</a-button>
    <div v-else>
      <p>Connected wallet address:{{ account }}</p>
      <button @click="disconnectWallet">Disconnect wallet</button>
    </div>
  </div>
</template>
<script setup>
import { ethers } from 'ethers';
import { ref, toRaw } from "vue";

const isConnected = ref(false)
const account = ref('')
const provider = ref(null)
const emit = defineEmits(["provider"]);

const connectWallet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      provider.value = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.value.getSigner();
      account.value = await signer.getAddress();
      isConnected.value = true;
      emit('provider', toRaw(provider.value));
    } catch (error) {
      console.error('连接钱包失败：', error);
    }
  } else {
    console.error('未检测到钱包插件');
  }
}

const disconnectWallet = () => {
  provider.value = null;
  account.value = '';
  isConnected.value = false;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
