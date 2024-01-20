<template>
  <a-spin class="account" :spinning="loading">
    <a-card class="account-card">
      <!--<a-row type="flex" justify="space-around">-->
      <a-row type="flex">
        <a-col :span="1">
          <a-checkbox v-model:checked="checkAll" :indeterminate="indeterminate" @change="onCheckAllChange"></a-checkbox>
        </a-col>
        <a-col :span="5">{{ props.address }}</a-col>
        <a-col :span="4">
          <a-space>
            <a-button @click="queryOrder">查询订单</a-button>
            <a-button @click="statistics">统计个数</a-button>
          </a-space>
        </a-col>
        <a-col :span="4">
          {{ total }}
        </a-col>
        <a-col :span="10">
          {{ stat }}
        </a-col>
      </a-row>
      <a-collapse v-model:activeKey="activeKey">
        <a-collapse-panel key="1" header="">
          <a-row :key="item.erc721TokenId" v-for="item in items" type="flex">
            <a-col :span="1">
              <a-checkbox v-model:checked="item.checked"></a-checkbox>
            </a-col>
            <a-col :span="2">
              {{ item.erc721TokenId }}
            </a-col>
            <a-col :span="2">
              {{ item.level }}
            </a-col>
            <a-col :span="2">
              <a-input placeholder="" v-model:value="item.paymentTokenAmount" />
            </a-col>
            <a-col :span="2">
              {{ item.price ? `Sell Price:${item.price}` : "" }}
            </a-col>
          </a-row>
        </a-collapse-panel>
      </a-collapse>
      <!--<a-row :key="item.erc721TokenId" v-for="item in items" type="flex" justify="space-around">-->
    </a-card>
  </a-spin>
</template>
<script setup>
import { ref, watch } from "vue";
import { create, all } from "mathjs";
import { createSDK } from '../../api/config'
import { ethers } from 'ethers'
import { message } from "ant-design-vue";
import { apiGetNFTByOwner } from "../../api/absc";
const props = defineProps({
  address: String,
  private_key: String,
});
const config = {}
const math = create(all, config)
const loading = ref(false)

const items = ref([])

const indeterminate = ref(false);
const checkAll = ref(false);

const stat = ref();
const total = ref();
const activeKey = ref(['1']);



const onCheckAllChange = (e) => {
  items.value.forEach(t => t.checked = e.target.checked)
  indeterminate.value = false;
};

const getTokenIds = async (address) => {
  let r = await apiGetNFTByOwner(address);
  if (r.code !== 200) {
    message.error(`apiGetNFTByOwner error:${r.message}`)
    items.value = []
    return
  }
  if (r.data && r.data.length > 0) {
    items.value = r.data.map(t => {
      let level = getLevel(t)
      return {
        erc721TokenAddress: '0x8deab6f048649bad8dd48ef49286354631b1ed54',
        erc721TokenId: String(t),
        paymentTokenAmount: 0,
        checked: false,
        level: level,
      }
    })
  } else {
    items.value = []
  }

  // items.value.push({
  //   erc721TokenAddress: '0xCA3605ca7cffAA27a8D9a9B7E41bcb3c51e590D9',
  //   erc721TokenId: "103",
  //   paymentTokenAmount: 0,
  //   checked: false,
  // });
}

const getLevel = (tokenId) => {
  if (tokenId > 0 && tokenId <= 13) {
    return "UR";
  }
  if (tokenId > 13 && tokenId <= 53) {
    return "SSR";
  }
  if (tokenId > 53 && tokenId <= 118) {
    return "SR";
  }
  if (tokenId > 118 && tokenId <= 248) {
    return "S";
  }
  if (tokenId > 248 && tokenId <= 508) {
    return "R";
  }
  if (tokenId > 508 && tokenId <= 1000) {
    return "N";
  }
  return "";
}

watch(
  () => items,
  val => {
    indeterminate.value = val.value.some(t => t.checked == true) && val.value.some(t => t.checked == false);
    checkAll.value = val.value.every(t => t.checked == true);
  }, { deep: true, immediate: true }
);

watch(
  () => props.address,
  (newVal) => {
    if (newVal) {
      getTokenIds(newVal)
    } else {
      items.value = [];
    }
  }, { deep: true, immediate: true }
);

const randomAmount = (sellAmount, sellRate) => {
  if (!sellAmount || !sellRate) {
    return;
  }
  items.value.forEach(t => t.paymentTokenAmount = random(sellAmount, sellRate));
  console.log(items.value)
}

const random = (sellAmount, sellRate) => {
  //生成随机数 
  const randomRate = Math.random() * sellRate;
  const rateAmount = math.chain(sellAmount).multiply(randomRate).divide(100).done();
  const amount = math.add(sellAmount, rateAmount)
  return math.round(amount, 4);
}

const sell = async () => {
  const sellList = JSON.parse(JSON.stringify(items.value.filter(t => t.checked)));
  if (sellList.length > 0) {
    if (sellList.some(t => t.paymentTokenAmount == 0)) {
      message.error("not input amount")
      throw new Error("not input amount")
    }
    loading.value = true;
    sellList.forEach(t => t.paymentTokenAmount = ethers.utils.parseEther(String(t.paymentTokenAmount)).toString());
    console.log("sellList", sellList);
    const sdk = createSDK(props.private_key);
    try {
      const r = await sdk.makeERC721SellOrders({ items: sellList });
      console.log("succeedList, ", r.succeedList)
      console.log("failedList, ", r.failedList)
      await queryOrder()
      loading.value = false;
    } catch (error) {
      console.error("error", error)
      loading.value = false;
    }

  }
}

const queryOrder = async () => {
  const sdk = createSDK(props.private_key);
  const orderList = await sdk.queryOrders({
    asset_contract_address: "0x8deab6f048649bad8dd48ef49286354631b1ed54",
    maker: props.address,
    limit: 50
  })
  const orderMap = orderList.reduce((acc, curr) => {
    acc.set(curr.tokenId, curr.price)
    return acc;
  }, new Map());
  console.log("orderMap", orderMap)
  items.value.forEach(r => r.price = orderMap.get(r.erc721TokenId));
}

const statistics = () => {
  total.value = 0;
  stat.value = new Map();
  for (const item of items.value) {
    if (stat.value.get(item.level) == undefined) {
      stat.value.set(item.level, 0)
    }
    if (item.price && item.price > 0) {
      total.value++;
      stat.value.set(item.level, stat.value.get(item.level) + 1);
    }
  }
}

defineExpose({ randomAmount, sell })

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.account {
  padding: 10px;
}

.account-card {
  margin: 10px;
}
</style>
