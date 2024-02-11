<template>
  <div class="FormCompinent">
    <a-card>
      <a-row type="flex" justify="space-around" align="middle">
        <a-col :span="4">{{ props.function.name }}</a-col>
        <a-col :span="14">
          <a-row type="flex" justify="start" align="middle">
            <a-col :key="input.name" v-for="input in props.function.inputs">
              <a-input :placeholder="input.name" v-model:value="input.param" />
            </a-col>

          </a-row>
        </a-col>
        <a-col :span="2">
          <a-button @click="submit" type="primary" :loading="loading">submit</a-button>
        </a-col>
        <a-col :span="4">
          <a-row type="flex" justify="start" align="middle">
            <a-col :key="output.name" v-for="output in props.function.outputs">
              <a-input :placeholder="output.name" v-model:value="output.result" />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { utils } from 'ethers';
const props = defineProps({
  function: Object,
  api: Object,
});

const loading = ref(false)

const value = ref('');

const submit = async () => {
  let func = props.function;
  console.log("api", func.inputs);
  // let params = func.inputs.map(t => {
  //   if (t.type == "address[]") {
  //     return t.param.split(",")
  //   } else {
  //     return t.param
  //   }
  // });
  let params = func.inputs.map(t => t.param)
  try {
    if (func.type
      && func.type == 'function'
      && func.stateMutability
      && (func.stateMutability == 'nonpayable' || func.stateMutability == 'payable')) {
      loading.value = true;
      let result = await props.api.sendTransaction(func.name, ...params);
      func.outputs[0].result = result;
      loading.value = false;
    } else if (func.type
      && func.type == 'function'
      && func.stateMutability
      && func.stateMutability == 'view'
    ) {
      loading.value = true;
      let result = await props.api.query(func.name, ...params);
      func.outputs[0].result = result;
      loading.value = false;
    }
  } catch (error) {
    loading.value = false;
  }
}



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
