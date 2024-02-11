<template>
  <div>
    <WalletComponent @provider="onProvider"></WalletComponent>
    <a-row>
      <a-col :span="24">
        <label>Add WhiteList</label>
      </a-col>
      <a-col :span="24">
        <a-button type="primary" @click="add">+</a-button>
        <a-button type="primary" @click="minus">-</a-button>
        <a-button type="primary" @click="restore">restore</a-button>
      </a-col>
    </a-row>
    <a-row v-bind:key="item.address" v-for="item in whiteList">
      <a-col :span="24">
        <a-input v-model:value="item.address"></a-input>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-button type="primary" :loading="loading" @click="confirm">Confirm</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WalletComponent from './WalletComponent.vue';
import { createContractApi } from '../api/contractApi';
import { message } from 'ant-design-vue';

const whiteList = ref([{
  address: "",
}]);
const loading = ref(false);

let abiData = [{
  "inputs": [
    {
      "internalType": "address[]",
      "name": "addrs",
      "type": "address[]"
    }
  ],
  "name": "addMembers",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}];

let contractAddress = '0xBc4B1e8caC87872AA6970f4d396C778CAE4F4C1F'
let provider = '';

const onProvider = data => {
  provider = data;
}

const add = () => {
  whiteList.value.push({ address: "" });
}

const minus = () => {
  whiteList.value.pop();
}

const restore = () => {
  whiteList.value = [{ address: "" }];
}

const confirm = async () => {
  let list = whiteList.value.filter(t => t.address).map(t => t.address);
  console.log("whiteList", list);
  if (provider && list.length > 0) {
    loading.value = true
    let contractApi = createContractApi(contractAddress, abiData, provider);
    let result = await contractApi.sendTransaction("addMembers", list);
    console.log("result", result);
    loading.value = false
  } else {
    message.error("error");
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
