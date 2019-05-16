<template>
    <v-container>
      <h1>รายรับรายจ่าย</h1>
      <v-dialog v-model="dialog" max-width="1000px">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" class="green darken-3" small>+ สร้างรายการ</v-btn>
        </template>
        <v-card>
            <v-card-title>
                <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field 
                    v-model="editedItem.name" 
                    label="รายการ">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field 
                    v-model="editedItem.price" 
                    label="ราคา">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field 
                    v-model="editedItem.remark" 
                    label="หมายเหตุ">
                    </v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">ยกเลิก</v-btn>
              <v-btn color="blue darken-1" flat @click="pushDB">บันทึก</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-divider class="my-3"></v-divider>
      <v-data-table
        :pagination.sync="pagination"
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
              @click="editItem(props.item.key)"
              v-ripple
            >
              edit
            </v-icon>
            <v-icon
              small
              @click="deleteItem(props.item.key)"
              v-ripple
            >
              delete
            </v-icon>
          </td>
        </template>
      </v-data-table>
      <v-dialog
        v-model="dialog2"
        max-width="290"
      >
        <v-card>
          <v-card-text>
            สำเร็จ
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="green darken-1"
              flat="flat"
              @click="dialog2 = false"
            >
              ตกลง
            </v-btn>
          </v-card-actions>        
        </v-card>
      </v-dialog>
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
       dialog2: false,
       dialog: false,
       myData: [],
       pagination:{
          rowsPerPage: 10
       },
       editedIndex: -1,
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
          { text: '', sortable: false}
        ],
        editedItem: {
          name: '',
          price: '',
          remark: ''
        }
    }
  },
  mounted: function () {
      var readRef = firebase.database().ref("Outin")
      var items = []
      var jsAccn = {
        date: "",
        name: "",
        price: "",
        remark: "",
        time: "",
        key: ""
      }
      var sortItems = []
      readRef.on('value', (snapshot) => {
        items = []
        snapshot.forEach( (childSnapshot) => {
          jsAccn = {
            date: childSnapshot.val().date,
            name: childSnapshot.val().name,
            price: childSnapshot.val().price,
            remark: childSnapshot.val().remark,
            time: childSnapshot.val().time,
            key: childSnapshot.key      
          }
          items.push(jsAccn)
          this.myData = items
        });
        sortItems = []
        var j = items.length-1
        for(;j>=0;j--){
          sortItems.push(items[j])
        }
        this.myData = sortItems
      });
  },
  methods: {
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      editItem (item) {
        this.editedIndex = item
        this.dialog = true
        var myref = firebase.database().ref("Outin/"+item)
        myref.on('value', (snapshot) => {
          this.editedItem.name = snapshot.val().name
          this.editedItem.price = snapshot.val().price
          this.editedItem.remark = snapshot.val().remark
        })
        
      },
      pushDB () {
        if(this.editedIndex == -1){
            var d = new Date 
            var myDate = ("0" + (d.getDate())).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2)
 + "/" + (d.getFullYear()+543) 
            var myTime = ("0" + (d.getHours())).slice(-2) + ":" + ("0" + (d.getMinutes())).slice(-2)  
            var readRef = firebase.database().ref("Outin")
            readRef.push().set({
                date: myDate,
                name: this.editedItem.name,
                price: this.editedItem.price,
                remark: this.editedItem.remark,
                time: myTime
            })
            this.dialog = false
            this.dialog2 = true
        }else{
          var readRef = firebase.database().ref("Outin/"+this.editedIndex)
          readRef.update({
            name: this.editedItem.name,
            price: this.editedItem.price,
            remark: this.editedItem.remark 
          })
          this.dialog = false
          this.dialog2 = true
        }
      },
      deleteItem(key){
        confirm('ต้องการลบรายการนี้ใช่หรือไม่') && firebase.database().ref("Outin/" + key).remove()
      }
      
  },
  computed: {
    formTitle () {
return this.editedIndex === -1 ? 'เพิ่มรายการไหม่' : 'แก้ไขรายการ'
    }
  },
}
</script>