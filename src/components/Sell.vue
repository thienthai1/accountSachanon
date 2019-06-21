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
      <sellCom></sellCom>
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
  export default {
  components: {
    sellCom
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