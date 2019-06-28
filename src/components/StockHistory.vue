<template>
    <div>
      <v-data-table
        :pagination.sync="pagination"
        :headers="headers"
        :items="myData"
        class="elevation-1"
        expand = "true"
      >
        <template v-slot:items="props">
          <td class="text-xs-left">{{ props.item.date }}</td>
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.type }}</td>
          <td :class="dealStatus(props.item.type)" class="text-xs-left">{{ props.item.quantity }}</td>
        </template>
      </v-data-table>
    </div>
</template>

<script>
import firebase from '../firebase'
export default {
    name: 'StockHis',
  data () {
    return {
      myData: [],
      headers: [
        {
          text: 'วันที่',
          value: 'date',
          sortable: false
        },
        { text: 'สินค้า', value: 'name',sortable: false },
        { text: 'ชนิด', value: 'type',sortable: false },
        { text: 'จำนวน', value: 'quantity',sortable: false },
        { text: '', sortable: false }
      ]
    }
  },
  mounted : function () {
    var readRef = firebase.database().ref("StockHist")
    var items
    var sortItems = []
    var jsAccn = {
          key: "",
          date: "",
          name: "",
          type: "",
          quantity: ""  
    }
    readRef.on('value', (snapshot) => {
      items = []
      snapshot.forEach( (childSnapshot) => {
        jsAccn = {
          key: childSnapshot.key,
          date: childSnapshot.val().date,
          name: childSnapshot.val().name,
          type: childSnapshot.val().type,
          quantity: childSnapshot.val().quantity
        }
        items.push(jsAccn)
        this.myData = items
      })
    })
      sortItems = []
      var j = items.length-1
      for(;j>=0;j--){
        sortItems.push(items[j])
      }
      this.myData = sortItems
  },
  methods: {
    dealStatus (type) {
      if(type == 'out'){
        return 'red--text'
      }else if(type == 'in'){
        return 'green--text'
      }
    }
  }
}
</script>