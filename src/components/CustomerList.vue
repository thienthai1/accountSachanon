<template>
    <div>
<v-dialog v-model="dialog" max-width="1000px">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" class="green darken-3 mb-3" small>+ สร้างรายการ</v-btn>
        </template>
        <v-card>
              <v-toolbar dark color="grey darken-3">
                <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6>
                    <v-text-field 
                    v-model="editedItem.name" 
                    label="ชื่อ">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field 
                    v-model="editedItem.phone" 
                    label="เบอร์โทร">
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs12 sm12 md12>
                    <v-text-field 
                    v-model="editedItem.address" 
                    label="ที่อยู่">
                    </v-text-field>                    
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs12 sm6 md6>
                    <v-text-field 
                    v-model="editedItem.tax" 
                    label="เลขที่ผู้เสียภาษี">
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
      <v-data-table
        :pagination.sync="pagination"
        :headers="headers"
        :items="myData"
        class="elevation-1"
        expand = "true"
      >
        <template v-slot:items="props">
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.address }}</td>
          <td class="text-xs-left">{{ props.item.phone }}</td>
          <td class="text-xs-left">{{ props.item.tax }}</td>
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
    </div>
</template>

<script>
import firebase from '../firebase'
  export default {
  name: 'Home',
  data () {
    return {
       currentItem: null,
        tab: null,
        myTabs: [
          'รายการสินค้า','ประวัติ'
        ],
       itemType: ['ผ้าเช็ดมือ', 'ผ้าเช็ดหน้า', 'ผ้าอเนกประสงค์', 'ผ้าเช็ดตัว','ผ้าเช็ดเท้า','ผ้าหลา','ผ้าห่ม','ผ้าเช็ดผม','ผ้าเย็น'],
       testdat: {
         moo: "wrah"
       },
       receiptPic: "",
       showPicDia: false,
       dialog3: false,
       dialog2: false,
       dialog: false,
       myData: [],
       pagination:{
          rowsPerPage: 10
       },
       editedIndex: -1,
       headers: [
          { text: 'ชื่อ', value: 'name', sortable: true },
          { text: 'ที่อยู่', value: 'address', sortable: false },
          { text: 'เบอร์โทร', value: 'phone', sortable: false },
          { text: 'เลขที่ผู้เสียภาษี', value: 'tax', sortable: false },
          { text: '', sortable: false}
        ],
        editedItem: {
          name: '',
          phone: '',
          address: '',
          tax: '',
          key: ''
        }
    }
  },
  mounted: function () {
      var readRef = firebase.database().ref("Customer")
      var items = []
      var jsAccn = {
          name: '',
          phone: '',
          address: '',
          tax: '',
          key: ''
      }
      var sortItems = []
      readRef.on('value', (snapshot) => {
        items = []
        snapshot.forEach( (childSnapshot) => {
          jsAccn = {
            key: childSnapshot.key,
            name: childSnapshot.val().name,
            phone: childSnapshot.val().phone,
            address: childSnapshot.val().address,  
            tax: childSnapshot.val().tax  
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
          this.editedItem = Object.assign({}, {
          key: '',
          name: '',
          phone: '',
          address: '',
          tax: ''
        })
          this.editedIndex = -1
        }, 300)
      },
      editItem (item) {
        this.editedIndex = item
        this.dialog = true
        var myref = firebase.database().ref("Customer/"+item)
        myref.on('value', (snapshot) => {
          this.editedItem.name = snapshot.val().name
          this.editedItem.phone = snapshot.val().phone
          this.editedItem.address = snapshot.val().address
          this.editedItem.tax = snapshot.val().tax
        })
        
      },
      pushDB () {
        if(this.editedIndex == -1){
              var readRef = firebase.database().ref("Customer")
              readRef.push().set({
                  name: this.editedItem.name,
                  phone: this.editedItem.phone,
                  address: this.editedItem.address,
                  tax: this.editedItem.tax,
              })
              this.dialog = false
              this.dialog2 = true
              this.editedItem = Object.assign({}, {
                name: '',
                phone: '',
                address: '',
                tax: ''
              })
        }else{
            var readRef = firebase.database().ref("Customer/"+this.editedIndex)
            readRef.update({
                    name: this.editedItem.name,
                    phone: this.editedItem.phone,
                    address: this.editedItem.address,
                    tax: this.editedItem.tax
            })
            this.dialog = false
            this.dialog2 = true
            
          }
      },
      deleteItem(key){
        confirm('ต้องการลบรายการนี้ใช่หรือไม่') && 
        firebase.database().ref("Customer/" + key).remove()
      },
      openPic(pic){
        this.showPicDia = true
        this.receiptPic = pic
      },
      previewType(type){
          if(type == "cash"){
            return "เงินสด"
          }else if(type == "check"){
            return "เช็ค"
          }else if(type == "card"){
            return "เครดิต/เดบิต"
          }else if(type == "debt"){
            return "ยังไม่จ่าย"
          }else{
            return "โอน"
          }
      },
      formatPrice(price){
        var p = price
        return p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      },
      dealStatus(status,type){
        if(status == 'income'){
            if(type == 'ยังไม่จ่าย'){
              return 'yellow--text'
            }else{
              return 'green--text'
            }
        }else if(status == 'outcome'){
            if(type == 'ยังไม่จ่าย'){
              return 'yellow--text'
            }else{
              return 'red--text'
            }
        }

      }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'เพิ่มรายการไหม่' : 'แก้ไขรายการ'
    }
  },
}
</script>