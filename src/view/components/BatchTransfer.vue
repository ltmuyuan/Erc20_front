<template>
  <a-spin :spinning="loading">
    <a-row>
      <a-col :span="24">
        <a-space>
          <a-input placeholder="批量转账金额" v-model:value="transferAmount" />
          <a-button @click="transfer">批量转账</a-button>
          <a-button @click="clickCheckAllChange">全选</a-button>
          <a-button @click="getBalance">余额查询</a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-row :key="item.account" v-for="item in items" type="flex">
      <a-col :span="1">
        <a-checkbox v-model:checked="item.checked"></a-checkbox>
      </a-col>
      <a-col :span="12">
        {{ item.address }}
      </a-col>
      <a-col :span="10">
        {{ item.balance }}
      </a-col>
    </a-row>
  </a-spin>
</template>

<script setup>
import { ref, toRaw, watch } from 'vue';
import { message } from 'ant-design-vue';

const props = defineProps({
  addresses: [],
  chainApi: Object,
});

const transferAmount = ref()
const items = ref();
const loading = ref(false)

const initItems = async (addresses) => {
  items.value = [];

  for (const address of addresses) {
    let balance
    if (props.chainApi) {
      balance = await toRaw(props.chainApi).getBalance(address.address)
    }
    items.value.push({
      address: address.address,
      checked: false,
      balance: balance
    })
  }
}

const transfer = async () => {
  if (props.chainApi) {
    if (!transferAmount.value) {
      message.error("not input amount")
      loading.value = false;
      return;
    }
    loading.value = true;
    const transList = items.value.filter(t => t.checked);
    for (const t of transList) {
      let r = await toRaw(props.chainApi).transfer(t.address, transferAmount.value);
      await r.wait();
      t.balance = await toRaw(props.chainApi).getBalance(t.address);
    }
    loading.value = false;
  } else {
    message.error("not connected wallet")
    loading.value = false;
  }
}

const getBalance = async () => {
  loading.value = true;
  await items.value.forEach(async t => {
    t.balance = await toRaw(props.chainApi).getBalance(t.address);
  });
  loading.value = false;
}

let checked = false;
const clickCheckAllChange = () => {
  checked = !checked;
  items.value.forEach(t => t.checked = checked);
};

watch(
  () => props.addresses,
  (newVal) => {
    if (newVal) {
      initItems(newVal)
    } else {
      items.value = [];
    }
  }, { deep: true, immediate: true }
);


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
