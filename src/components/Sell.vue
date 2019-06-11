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
                <v-layout>
                      <v-switch
                        :label="switch1 === false ? 'ลูกค้าเก่า' : 'ลูกค้าไหม่'"
                        v-model="switch1"
                        color="green"
                      ></v-switch>
                </v-layout>
                <template v-if="switch1==false">
                        <v-layout>
                        <v-flex xs12 sm6 md6>
                          <v-select
                            :items="items"
                            label="ชื่อผู้ซื้อ"
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                          <v-text-field 
                          v-model="customer.call" 
                          label="เบอร์โทรผู้ซื้อ"
                          disabled="true"
                          >
                          </v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 sm12 md12>
                          <v-text-field 
                          v-model="customer.address" 
                          label="ที่อยู่ผู้ซื้อ"
                          disabled="true"
                          >
                          </v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 sm12 md12>
                          <v-text-field 
                          v-model="customer.tax" 
                          label="เลขที่ผู้เสียภาษี"
                          disabled="true"
                          >
                          </v-text-field>
                        </v-flex>
                      </v-layout>
                </template>
                <template v-else>
                        <v-layout>
                        <v-flex xs12 sm6 md6>
                          <v-text-field 
                          v-model="customer.name" 
                          label="ชื่อผู้ซื้อ"
                          >
                          </v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                          <v-text-field 
                          v-model="customer.call" 
                          label="เบอร์โทรผู้ซื้อ"
                          >
                          </v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 sm12 md12>
                          <v-text-field 
                          v-model="customer.address" 
                          label="ที่อยู่ผู้ซื้อ"
                          >
                          </v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 sm12 md12>
                          <v-text-field 
                          v-model="customer.tax" 
                          label="เลขที่ผู้เสียภาษี"
                          >
                          </v-text-field>
                        </v-flex>
                      </v-layout>
                </template>
                <!-- <v-layout v-else>
                        <v-layout>
                        <v-flex xs12 sm6 md6>
                          <v-select
                            :items="items"
                            label="ชื่อผู้ซื้อ"
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                          <v-text-field 
                          v-model="customer.call" 
                          label="เบอร์โทรผู้ซื้อ"
                          disabled="true"
                          >
                          </v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 sm12 md12>
                          <v-text-field 
                          v-model="customer.address" 
                          label="ที่อยู่ผู้ซื้อ"
                          disabled="true"
                          >
                          </v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12 sm12 md12>
                          <v-text-field 
                          v-model="customer.tax" 
                          label="เลขที่ผู้เสียภาษี"
                          disabled="true"
                          >
                          </v-text-field>
                        </v-flex>
                      </v-layout>                 
                </v-layout> -->
                <v-layout v-for="n in totalList">
                  <v-flex xs12 sm8 md8>
                  <v-select
                      :items="dataItems"
                      v-model="e11"
                      label="รายการสินค้า"
                      item-text="name"
                      item-value="name"
                      max-height="300px"
                      class="select2"
                    >
                      <template slot="selection" slot-scope="data">
                          <span style="font-size:15px">{{ data.item.name }}</span>
                      </template>
                      <template slot="item" slot-scope="data">
                        <template v-if="typeof data.item !== 'object'">
                          <v-list-tile-content v-text="data.item"></v-list-tile-content>
                        </template>
                        <template v-else>
                          <v-list-tile-content>
                            <v-list-tile-title style="font-size:15px" v-text="data.item.name"></v-list-tile-title>
                          </v-list-tile-content>
                        </template>
                      </template>
                    </v-select>
                  </v-flex>
                  <v-flex xs12 sm2 md2>
                    <v-text-field 
                    v-model="editedItem.quantity" 
                    label="จำนวน">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm2 md2>
                    <v-text-field 
                    v-model="editedItem.price" 
                    label="ราคา"
                    disabled="true"
                    >
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout>
                      <v-btn @click="addItem()" flat color="green">
                        + เพิ่มรายการ
                      </v-btn>
                      <v-btn @click="removeItem()" flat color="red">
                        - ลดรายการ
                      </v-btn>
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
        :headers="headers"
        :items="desserts"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-right">{{ props.item.calories }}</td>
          <td class="text-xs-right">{{ props.item.fat }}</td>
          <td class="text-xs-right">{{ props.item.carbs }}</td>
          <td class="text-xs-right">{{ props.item.protein }}</td>
          <td class="text-xs-right">{{ props.item.iron }}</td>
        </template>
      </v-data-table>
    </v-container>
</template>

<style>
.select2 v-select__slot {
  margin-bottom:-10px
}
/* .v-select__selections {
  margin-bottom: 9px
} */
</style>

<script>
import firebase from '../firebase'
  export default {
  name: 'Sell',
  data () {
    return {
        switch1: true,
        customer: {
          name:'',
          call:'',
          address:'',
          tax: ''
        },
        e11: [],
        dataItems: [
          // { header: 'ผ้าเช็ดตัว' },
          // { divider: true },
          // { header: 'ผ้าเช็ดเท้า' },
          // { divider: true },
          // { header: 'ผ้าอเนกประสงค์' },
          // { divider: true },
          // { header: 'ผ้าหลา' },
          // { divider: true },
          // { header: 'ผ้าเย็น' },
        ],
      selected: 'A',
      options: {
        First: [
          { text: 'One', value: 'A' },
          { text: 'Two', value: 'B' }
        ],
        Second: [
          { text: 'Three', value: 'C' }
        ]
      },
      editedIndex: -1,
      totalList: 1,
      dialog: false,
      currentItem: null,
      tab: null,
      myTabs: [
        'รายการขาย','รายการเสนอราคา'
      ],
      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' }
      ],
      editedItem: {
        products: '',
        quantity: '',
        price: '',
        type: '',
        key: ''
      },
      stocksItem: ["moo"]
    }
  },
  mounted: function () {
    var readRef = firebase.database().ref("Stocks")
    var items = []
    var jsKeep = {
      key: '',
      price: '',
      products: '',
      quantity: '',
      type: ''
    }
    readRef.on('value', (snapshot) => {
       snapshot.forEach( (childSnapshot) => {
         jsKeep = {
           key: childSnapshot.key,
           price: childSnapshot.val().price,
           products: childSnapshot.val().products,
           quantity: childSnapshot.val().quantity,
           type: childSnapshot.val().type
         }
         items.push(jsKeep)
         this.stocksItem = items
       })
       var i,j
       for(i = 0;i<7;i++){
         if(i == 0){
            this.dataItems.push({header: "ผ้าเช็ดตัว"})
         }else if(i == 1){
            this.dataItems.push({header: "ผ้าเช็ดเท้า"})
         }else if(i == 2){
            this.dataItems.push({header: "ผ้าเช็ดเอนกประสงค์"})          
         }else if(i == 3){
            this.dataItems.push({header: "ผ้าหลา"})           
         }else if(i == 4){
            this.dataItems.push({header: "ผ้าเย็น"})           
         }else if(i == 5){
            this.dataItems.push({header: "ผ้าเช็ดหน้า"})           
         }else if(i == 6){
            this.dataItems.push({header: "ผ้าเช็ดผม"})           
         }
         for(j = 0;j < this.stocksItem.length;j++){
           if(i == 0){
             if(this.stocksItem[j].type == "ผ้าเช็ดตัว"){
               this.dataItems.push({name: this.stocksItem[j].products})
             }
           }else if(i == 1){
             if(this.stocksItem[j].type == "ผ้าเช็ดเท้า"){
               this.dataItems.push({name: this.stocksItem[j].products})
             } 
           }else if(i == 2){
             if(this.stocksItem[j].type == "ผ้าเช็ดเอนกประสงค์"){
               this.dataItems.push({name: this.stocksItem[j].products})
             } 
           }else if(i == 3){
             if(this.stocksItem[j].type == "ผ้าหลา"){
               this.dataItems.push({name: this.stocksItem[j].products})
             } 
           }else if(i == 4){
             if(this.stocksItem[j].type == "ผ้าเย็น"){
               this.dataItems.push({name: this.stocksItem[j].products})
             } 
           }else if(i == 5){
             if(this.stocksItem[j].type == "ผ้าเช็ดหน้า"){
               this.dataItems.push({name: this.stocksItem[j].products})
             } 
           }else if(i == 6){
             if(this.stocksItem[j].type == "ผ้าเช็ดผม"){
               this.dataItems.push({name: this.stocksItem[j].products})
             } 
           }
         }
         this.dataItems.push({ divider: true })
       }
    })
    console.log(this.stocksItem[0].type)
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
          this.totalList = 1
        }, 300)
      },
      addItem () {
        this.totalList += 1
      },
      removeItem () {
        if(this.totalList != 1){
          this.totalList -= 1
        }
      }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'เพิ่มรายการไหม่' : 'แก้ไขรายการ'
    }
  }
}
</script>