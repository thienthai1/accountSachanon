<template>
    <v-container>
      <h1>รายรับรายจ่าย</h1>
      <v-divider class="my-3"></v-divider>
      <v-data-table
        :headers="headers"
        :items="myData"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.date }}</td>
          <td class="text-xs-left">{{ props.item.time }}</td>
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.price }}</td>
          <td class="text-xs-left">{{ props.item.remark }}</td>
          <td class="text-xs-left">
            <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
            >
              edit
            </v-icon>
            <v-icon
              small
              @click="deleteItem(item)"
            >
              delete
            </v-icon>
          </td>
        </template>
      </v-data-table>
    </v-container>
</template>

<script>
import firebase from '../firebase'
  export default {
  name: 'Home',
  beforeCreate() {
  },
  data () {
    return {
       myData: [],
       headers: [
          {
            text: 'วันที่',
            align: 'left',
            sortable: false,
            value: 'date',
          },
          { text: 'เวลา', value: 'time', sortable: false },
          { text: 'รายการ', value: 'name', sortable: false },
          { text: 'ราคา', value: 'price', sortable: false },
          { text: 'หมายเหตุ', value: 'remark', sortable: false },
          { text: ''}
        ]
    }
  },
  mounted: function () {
      var readRef = firebase.database().ref("Outin")
      var items = []
      var sortItems = []
      readRef.on('value', (snapshot) => {
        items = []
        snapshot.forEach( (childSnapshot) => {
          items.push(childSnapshot.val())
          this.myData = items
        });
        sortItems = []
        var j = items.length-1
        for(;j>=0;j--){
          sortItems.push(items[j])
        }
        this.myData = sortItems
      });
      // this.myData = sortItems 
  },
}
</script>