<template>
  <div>
    <WalletComponent @provider="onProvider"></WalletComponent>
    <a-tabs v-model:activeKey="activeKey" centered>
      <a-tab-pane key="1" tab="AddWhiteList 1">
        <a-row>
          <a-col :span="24">
            <a-button type="primary" @click="add">+</a-button>
            <a-button type="primary" @click="minus">-</a-button>
            <a-button type="primary" @click="restore">restore</a-button>
          </a-col>
        </a-row>
        <a-row v-bind:key="index" v-for="(item, index) in whiteList">
          <a-col :span="23">
            <a-input @change="checkWhiteList(item)" v-model:value="item.address"></a-input>
          </a-col>
          <a-col :span="1">
            <CheckCircleTwoTone two-tone-color="#52c41a" v-if="item.check" />
            <CloseCircleTwoTone two-tone-color="#eb2f96" v-else />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-button type="primary" :loading="loading" @click="confirm">Confirm</a-button>
          </a-col>
        </a-row>
        <div>
          {{ errorMsg }}
        </div>
        <div>
          {{ resultStatus }}
        </div>
        <div v-if="result">
          <a :href="result" target="_blank">{{ result }}</a>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="AddWhiteList 2">
        <div>
          <a-row v-bind:key="index" v-for="(item, index) in whiteList">
            <a-col :span="23">
              <a-textarea v-model:value="whiteList2" placeholder="Multiple address line breaks" :rows="10" allow-clear />
            </a-col>
            <a-col :span="1">
              <div style="height: 6px;"></div>
              <div v-bind:key="index" v-for="(item, index) in checkList">
                <CheckCircleTwoTone two-tone-color="#52c41a" v-if="item" />
                <CloseCircleTwoTone two-tone-color="#eb2f96" v-else />
              </div>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-button type="primary" @click="restore2">restore</a-button>
              <a-button type="primary" @click="checkWhiteList2">check</a-button>
              <a-button type="primary" :loading="loading2" @click="confirm2">Confirm</a-button>
            </a-col>
          </a-row>
          <div>
            {{ errorMsg2 }}
          </div>
          <div>
            {{ resultStatus2 }}
          </div>
          <div v-if="result2">
            <a :href="result2" target="_blank">{{ result2 }}</a>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import WalletComponent from './WalletComponent.vue';
import { createContractApi } from '../api/contractApi';
import { message } from 'ant-design-vue';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons-vue';
import { utils } from 'ethers';
const activeKey = ref('2')
const whiteList = ref([{
  address: "",
}]);
const loading = ref(false);
const result = ref("");
const resultStatus = ref("");
const errorMsg = ref("");
let abiData =
  [
    {
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
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "discountList",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

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
  result.value = "";
  resultStatus.value = "";
  loading.value = false;
  errorMsg.value = "";
}

const checkWhiteList = async (item) => {
  console.log("item", item.address)
  if (provider) {
    if (item.address && utils.isAddress(item.address)) {
      let contractApi = createContractApi(contractAddress, abiData, provider);
      let num = await contractApi.query("discountList", item.address);
      console.log("num", num);
      item.check = num.toNumber() == 0;
    } else {
      item.check = false;
    }
  } else {
    message.error("not connected to wallet");
  }
}

const confirm = async () => {
  let list = whiteList.value.filter(t => t.address).map(t => t.address);
  console.log("whiteList", list);
  try {
    if (provider && list.length > 0) {
      loading.value = true
      let contractApi = createContractApi(contractAddress, abiData, provider);
      let res = await contractApi.sendTransaction("addMembers", list);
      console.log("result", res);
      resultStatus.value = res.status == 1 ? "Execution succeeded" : "Execution failed"
      result.value = "https://etherscan.io/tx/" + res.transactionHash
    } else {
      message.error("not connected to wallet");
    }
  } catch (error) {
    message.error(error.message);
    errorMsg.value = error.message;
  } finally {
    loading.value = false
  }

}

const whiteList2 = ref("")
const checkList = ref([])
const loading2 = ref(false)
const result2 = ref("");
const resultStatus2 = ref("");
const errorMsg2 = ref("");
const restore2 = () => {
  whiteList2.value = "";
  result2.value = "";
  resultStatus2.value = "";
  loading2.value = false;
  errorMsg2.value = "";
  checkList.value = [];
}

const confirm2 = async () => {
  let list = whiteList2.value.split("\n");
  console.log("whiteList", list);
  try {
    if (provider && list.length > 0) {
      loading2.value = true
      let contractApi = createContractApi(contractAddress, abiData, provider);
      let res = await contractApi.sendTransaction("addMembers", list);
      console.log("result", res);
      resultStatus2.value = res.status == 1 ? "Execution succeeded" : "Execution failed"
      result2.value = "https://etherscan.io/tx/" + res.transactionHash
    } else {
      message.error("not connected to wallet");
    }
  } catch (error) {
    message.error(error.message);
    errorMsg2.value = error.message;
  } finally {
    loading2.value = false
  }
}
const checkWhiteList2 = async () => {
  if (provider) {
    let contractApi = createContractApi(contractAddress, abiData, provider);
    let list = whiteList2.value.split("\n");
    checkList.value = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i] && utils.isAddress(list[i])) {
        let num = await contractApi.query("discountList", list[i]);
        console.log("num", num.toNumber());
        checkList.value.push(num.toNumber() == 0);
      } else {
        checkList.value.push(false);
      }
    }
  } else {
    message.error("not connected to wallet");
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
