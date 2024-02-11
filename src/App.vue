<template>
  <AddMember></AddMember>
</template>

<script>
//import ContractOp from './components/ContractOp.vue'
import AddMember from './components/AddMember.vue';
export default {
  name: 'App',
  components: {
    //  ContractOp
    AddMember
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
