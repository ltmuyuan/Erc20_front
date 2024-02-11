<template>
  <div class="ContractOp">
    <WalletComponent @provider="onProvider"></WalletComponent>
    <UploadFile @abiData="onAbiData"></UploadFile>
    <a-row>
      <a-col>
        <label>Contract address</label>
      </a-col>
      <a-col>
        <a-input v-model:value="contractAddress"></a-input>
      </a-col>
      <a-col>
        <a-button type="primary" @click="confirm">Confirm</a-button>
      </a-col>
    </a-row>
    <a-card title="Contract send">
      <FormComponent :key="tx.name" v-for="tx in txList" :function="tx" :api="contractApi"></FormComponent>
    </a-card>
    <a-card title="Contract call">
      <FormComponent :key="tx.name" v-for="tx in callList" :function="tx" :api="contractApi"></FormComponent>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UploadFile from './UploadFile.vue'
import WalletComponent from './WalletComponent.vue';
import FormComponent from './FormComponent.vue';
import { createContractApi } from '../api/contractApi';
const txList = ref([]);
const callList = ref([]);
const contractAddress = ref('');
const contractApi = ref({})

let abiData = '';
let provider = '';

const onProvider = data => {
  provider = data;
}

const onAbiData = data => {
  abiData = JSON.parse(data);

}
const confirm = () => {
  console.log(abiData, provider, contractAddress.value)
  if (abiData && provider && contractAddress.value) {
    contractApi.value = createContractApi(contractAddress.value, abiData, provider);
    txList.value = abiData.filter(x => (x.type
      && x.type == 'function'
      && x.stateMutability
      && (x.stateMutability == 'nonpayable' || x.stateMutability == 'payable')
    ));
    callList.value = abiData.filter(x => (x.type
      && x.type == 'function'
      && x.stateMutability
      && x.stateMutability == 'view'
    ));
  }
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
