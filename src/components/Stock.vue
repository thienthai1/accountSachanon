<template>
    <v-container>
      <h1>สต็อคสินค้า</h1>
      <v-tabs class="mt-3" v-model="currentItem">
          <v-tab
            v-for="n in myTabs"
            :key="n"
          >
            {{ n }}
          </v-tab>
      </v-tabs>
      <h4>{{ myTabs[currentItem] }}</h4>
      <v-divider class="my-1"></v-divider>
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
                  <v-flex xs12 sm4 md4>
                    <v-text-field 
                    v-model="editedItem.products" 
                    label="รายการ">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field 
                    v-model="editedItem.quantity" 
                    label="จำนวน">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4 md4>
                    <v-text-field 
                    v-model="editedItem.price" 
                    label="ราคา">
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs12 sm6 md4>
                    <v-select
                      :items="itemType"
                      label="ชนิดสินค้า"
                      solo
                      v-model="editedItem.type"
                    ></v-select>
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
          <td class="text-xs-left">{{ props.item.products }}</td>
          <td class="text-xs-left">{{ props.item.type }}</td>
          <td class="text-xs-left">{{ props.item.quantity }}</td>
          <td class="text-xs-left">{{ props.item.price }}</td>
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
          { text: 'รายการ', value: 'products', sortable: true },
          { text: 'ประเภท', value: 'type', sortable: false },
          { text: 'จำนวน', value: 'quantity', sortable: false },
          { text: 'ราคา', value: 'price', sortable: false },
          { text: '', sortable: false}
        ],
        editedItem: {
          products: '',
          quantity: '',
          price: '',
          type: '',
          key: ''
        }
    }
  },
  mounted: function () {
      var readRef = firebase.database().ref("Stocks")
      var items = []
      var jsAccn = {
          key: '',
          products: '',
          price: '',
          type: '',
          quantity: ''
      }
      var sortItems = []
      readRef.on('value', (snapshot) => {
        items = []
        snapshot.forEach( (childSnapshot) => {
          jsAccn = {
            key: childSnapshot.key,
            products: childSnapshot.val().products,
            quantity: childSnapshot.val().quantity,
            price: childSnapshot.val().price,  
            type: childSnapshot.val().type  
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
          products: '',
          quantity: '',
          type: '',
          price: ''
        })
          this.editedIndex = -1
        }, 300)
      },
      editItem (item) {
        this.editedIndex = item
        this.dialog = true
        var myref = firebase.database().ref("Stocks/"+item)
        myref.on('value', (snapshot) => {
          this.editedItem.products = snapshot.val().products
          this.editedItem.quantity = snapshot.val().quantity
          this.editedItem.type = snapshot.val().type
          this.editedItem.price = snapshot.val().price
        })
        
      },
      pushDB () {
        if(this.editedIndex == -1){
              var readRef = firebase.database().ref("Stocks")
              readRef.push().set({
                  products: this.editedItem.products,
                  quantity: this.editedItem.quantity,
                  type: this.editedItem.type,
                  price: this.editedItem.price,
              })
              this.dialog = false
              this.dialog2 = true
              this.editedItem = Object.assign({}, {
                products: '',
                quantity: '',
                price: '',
                type: ''
              })
        }else{
            var readRef = firebase.database().ref("Stocks/"+this.editedIndex)
            readRef.update({
                    products: this.editedItem.products,
                    quantity: this.editedItem.quantity,
                    price: this.editedItem.price,
                    type: this.editedItem.type
            })
            this.dialog = false
            this.dialog2 = true
            
          }
      },
      deleteItem(key){
        confirm('ต้องการลบรายการนี้ใช่หรือไม่') && 
        firebase.database().ref("Stocks/" + key).remove()
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