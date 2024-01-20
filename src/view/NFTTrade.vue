<template>
  <div class="nft-trade">
    <a-row>
      <a-col :span="12">
        <WalletComponent @provider="onProvider"></WalletComponent>
        <UploadFile @abiData="onAddress"></UploadFile>
      </a-col>
      <a-col :span="12">
        <BatchTransfer :addresses="addresses" :chainApi="api"></BatchTransfer>
      </a-col>
    </a-row>
  </div>
  <div>
    <a-row>
      <a-col>
        <a-button @click="synchronous" :loading="loading">同步 NFT</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col>
        <a-space>
          <a-input placeholder="上架金额" v-model:value="sellAmount" />
          <a-input placeholder="随机系数例如随机上浮10% 填写10" v-model:value="sellRate" />
          <a-button @click="randomAmount">随机上架金额</a-button>
          <a-button @click="sell">批量上架</a-button>
        </a-space>
      </a-col>
    </a-row>

  </div>
  <div>
    <AccountsComponent :key="item.address" v-for="item in addresses" :address="item.address"
      :private_key="item.private_key" :ref="setAccountRef">
    </AccountsComponent>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UploadFile from '../components/UploadFile.vue'
import WalletComponent from '../components/WalletComponent.vue';
import AccountsComponent from './components/AccountsComponent.vue';
import chainApi from '../api/chainApi.js'
import { message } from 'ant-design-vue';
import BatchTransfer from './components/BatchTransfer.vue';
import { apiSynchronous } from "../api/absc";


const sellAmount = ref()
const sellRate = ref()
const addresses = ref([])
const accountRefs = []
const api = ref();
const loading = ref(false);

const setAccountRef = el => {
  if (el) {
    accountRefs.push(el)
  }
}

const onProvider = data => {
  console.log("data", data);
  api.value = new chainApi(data);
}

const onAddress = data => {
  addresses.value = JSON.parse(data);
}

const randomAmount = () => {
  if (!sellAmount.value) {
    return;
  }
  if (!sellAmount.value || !sellRate.value) {
    return;
  }
  accountRefs.forEach(t => t.randomAmount(sellAmount.value, sellRate.value));
}

const sell = () => {
  accountRefs.forEach(t => t.sell());
}

const synchronous = async () => {
  loading.value = true;
  await apiSynchronous();
  loading.value = false
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
