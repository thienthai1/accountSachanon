<template>
    <v-container>
      <h1>รายการขาย</h1>
      <v-tabs class="mt-3" v-model="currentItem">
          <v-tab
            v-for="n in myTabs"
            :key="n"
          >
            {{ n }}
          </v-tab>
      </v-tabs>
      <v-divider class="my-3"></v-divider>
      <template v-if="myTabs[currentItem] == 'รายการขาย'">
        <sellCom></sellCom>
      </template>
      <template v-else-if="myTabs[currentItem] == 'รายชื่อลูกค้า'">
        <customerList></customerList>
      </template>
    </v-container>
</template>

<style>
.select2 v-select__slot {
  margin-bottom:-10px
}
</style>

<script>
import firebase from '../firebase'
import sellCom from './sellCom.vue'
import customerList from './CustomerList.vue'
  export default {
  components: {
    sellCom,
    customerList
  },
  name: 'Sell',
  data () {
    return {
      currentItem: null,
      tab: null,
      myTabs: [
        'รายการขาย','รายการเสนอราคา','รายชื่อลูกค้า'
      ],
    }
  },
}
</script>