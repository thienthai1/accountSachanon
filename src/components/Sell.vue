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
                    <v-flex xs12 sm6 md6>
                      <v-select
                        :items="getListCustomer()"
                        label="ชื่อผู้ซื้อ"
                        v-model="customerSelect"
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field 
                      v-model="customerDetail.phone" 
                      label="เบอร์โทรผู้ซื้อ"
                      disabled="true"
                      >
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex xs12 sm12 md12>
                      <v-text-field 
                      v-model="customerDetail.address" 
                      label="ที่อยู่ผู้ซื้อ"
                      disabled="true"
                      >
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex xs12 sm12 md12>
                      <v-text-field 
                      v-model="customerDetail.tax" 
                      label="เลขที่ผู้เสียภาษี"
                      disabled="true"
                      >
                      </v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout v-for="n in totalList">
                  <v-flex xs12 sm6 md6>
                  <v-select
                      :items="dataItems"
                      v-model="editedItem[n-1].name"
                      label="รายการสินค้า"
                      item-text="name"
                      item-value="name"
                      max-height="300px"
                      class="select2"
                    >
                      <template slot="selection" slot-scope="data">
                          <span style="font-size:15px">{{ priceSet(data.item.name,data.item.price,n-1) }}</span>
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
                  <v-flex xs12 sm3 md3>
                    <v-text-field 
                    v-model="editedItem[n-1].quantity" 
                    label="จำนวน">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm3 md3>
                    <v-text-field 
                    v-model="editedItem[n-1].price" 
                    label="ราคาต่อหน่วย"
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
                <v-layout justify-end>
                  <v-flex xs12 sm2 md2>
                    <v-text-field 
                    v-model="customerDetail.vat" 
                    label="VAT %"
                    >
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout justify-end>
                  <v-flex xs12 sm2 md2>
                    <v-text-field 
                    v-model="customerDetail.discount" 
                    label="ลดราคา %"
                    >
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout justify-end>
                  <v-flex xs12 sm2 md2>
                    <v-text-field 
                    v-model="total" 
                    label="ราคารวม"
                    disabled=true
                    >
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <layout>
                  <v-flex xs12 sm12 md12>
                    <v-text-field 
                    v-model="customerDetail.remark" 
                    label="หมายเหตุ"
                    >
                    </v-text-field>                    
                  </v-flex>
                </layout>
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
        :items="dataOrders"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.date }}</td>
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.total }}</td>
          <td class="text-xs-left">

            <v-icon
              small
              class="mr-2"
              @click="openPic(props.item.url)"
              v-ripple
            >
              print
            </v-icon>
            <v-icon
              small
              class="mr-2"
              @click="editItem(props.item.key,props.item.myitems,props.item.keyCustomer,props.item.remark,props.item.discount)"
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
        total: '',
        md: 1234,
        dataOrders: [],
        dialog2: false,
        customerSelect: '',
        customerDetail: {
          key: '',
          name: '',
          phone: '',
          address: '',
          tax: '',
          remark: '',
          discount: '',
          vat: ''
        },
        customerList: [],
        totalList: 1,
        switch1: false,
        customer: {
          name:'',
          call:'',
          address:'',
          tax: ''
        },
        e11: [],
        dataItems: [
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
      dialog: false,
      currentItem: null,
      tab: null,
      myTabs: [
        'รายการขาย','รายการเสนอราคา','รายชื่อลูกค้า'
      ],
      headers: [
        {
          text: 'วันที่',
          value: 'date',
          sortable: false
        },
        { text: 'ชื่อลูกค้า', value: 'name',sortable: false },
        { text: 'ราคารวม', value: 'total',sortable: false },
        { text: '', sortable: false }
      ],
      editedItem: [{
        quantity: '',
        price: '',
        name: ''
      }],
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
            this.dataItems.push({header: "ผ้าอเนกประสงค์"})          
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
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price})
             }
           }else if(i == 1){
             if(this.stocksItem[j].type == "ผ้าเช็ดเท้า"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price})
             } 
           }else if(i == 2){
             if(this.stocksItem[j].type == "ผ้าอเนกประสงค์"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price})
             } 
           }else if(i == 3){
             if(this.stocksItem[j].type == "ผ้าหลา"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price})
             } 
           }else if(i == 4){
             if(this.stocksItem[j].type == "ผ้าเย็น"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price})
             } 
           }else if(i == 5){
             if(this.stocksItem[j].type == "ผ้าเช็ดหน้า"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price})
             } 
           }else if(i == 6){
             if(this.stocksItem[j].type == "ผ้าเช็ดผม"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price})
             } 
           }
         }
         this.dataItems.push({ divider: true })
       }
    })
    readRef = firebase.database().ref("Customer")
    var jsKeep = {
      key: '',
      name: '',
      phone: '',
      address: '',
      tax: ''
    }
    items = []
    readRef.on('value', (snapshot) => {
      snapshot.forEach( (childSnapshot) => {
        jsKeep = {
          key: childSnapshot.key,
          name: childSnapshot.val().name,
          phone: childSnapshot.val().phone,
          address: childSnapshot.val().address,
          tax: childSnapshot.val().tax
        }
        items.push(jsKeep)
        this.customerList = items
      })
    })

    readRef = firebase.database().ref("SellOrders")
    var jsAccn = {
          key: "",
          name: "",
          phone: "",
          tax: "",
          address: "",
          date: "",
          myitems: "",
          remark: ""     
    }
    var sortItems = []
    readRef.on('value', (snapshot) => {
      items = []
      snapshot.forEach( (childSnapshot) => {
        jsAccn = {
          // key: childSnapshot.val().key,
          key: childSnapshot.key,
          keyCustomer: childSnapshot.val().key,
          name: childSnapshot.val().name,
          phone: childSnapshot.val().phone,
          tax: childSnapshot.val().tax,
          address: childSnapshot.val().address,
          date: childSnapshot.val().date,
          myitems: childSnapshot.val().items,
          total: this.calTotal(childSnapshot.val().items,childSnapshot.val().discount),
          remark: childSnapshot.val().remark,
          discount: childSnapshot.val().discount   
        }
        items.push(jsAccn)
        this.dataOrders = items
      });
      sortItems = []
      var j = items.length-1
      for(;j>=0;j--){
        sortItems.push(items[j])
      }
      this.dataOrders = sortItems
    });

  },
  methods: {
      pushDB () {
        if(this.editedIndex == -1){
              var readRef = firebase.database().ref("SellOrders")
              var d = new Date 
              var myDate = ("0" + (d.getDate())).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2)
      + "/" + (d.getFullYear()+543)
              readRef.push().set({
                key: this.customerDetail.key,
                name: this.customerDetail.name,
                phone: this.customerDetail.phone,
                tax: this.customerDetail.tax,
                address: this.customerDetail.address,
                date: myDate,
                items: this.editedItem,
                remark: this.customerDetail.remark,
                discount: this.customerDetail.discount
              })
              this.dialog = false
              this.dialog2 = true
              this.customerDetail = {
                key: '',
                name: '',
                phone: '',
                address: '',
                tax: '',
                remark: '',
                discount: ''
              }
              this.editedItem[0].quantity = ''
              this.editedItem[0].type = ''
              this.editedItem[0].price = ''
        }else{
              var readRef = firebase.database().ref("SellOrders/"+this.editedIndex)
              readRef.update({
                items: this.editedItem,
                discount: this.customerDetail.discount
              })
              this.dialog = false
              this.dialog2 = true
              this.customerDetail = {
                key: '',
                name: '',
                phone: '',
                address: '',
                tax: '',
                discount: ''
              }
                this.editedItem[0].quantity = ''
                this.editedItem[0].type = ''
                this.editedItem[0].price = ''
        }
      },
      close () {
        this.dialog = false
        this.customerSelect = ''
        console.log(this.editedItem)
        this.customerDetail = {
          key: '',
          name: '',
          phone: '',
          address: '',
          tax: '',
          discount: ''
        } 
        setTimeout(() => {
          this.editedItem = [{
              quantity: '',
              price: '',
              name: ''
          }]
          this.editedIndex = -1
          this.totalList = 1
          this.total = 0
        }, 300)
      },
      addItem () {
        //console.log(this.prodList)
        this.editedItem.push(
          {
            quantity: '',
            price: '',
            name: ''
          }
        )
        // this.prodList.push([])
        this.totalList += 1
      },
      removeItem () {
        if(this.totalList > 1){
          this.editedItem.pop()
          this.totalList -= 1
        }
      },
      priceSet (name,price,n) {
        this.editedItem[n].price = price
        this.editedItem[n].name = name
        // console.log(this.editedItem)
        return name
      },
      getListCustomer () {
        var i = 0
        var items = []
        for(i;i<this.customerList.length;i++){
          items.push(this.customerList[i].name)
        }
        return items.sort()
      },
      editItem (item,myItems,key,remark,discount) {
        //console.log(discount)
        this.editedIndex = item
        this.dialog = true 
        var i = 0
        for(i;i<this.customerList.length;i++){
          if(this.customerList[i].key == key){
            this.customerDetail = {
              key: this.customerList[i].key,
              name: this.customerList[i].name,
              address: this.customerList[i].address,
              phone: this.customerList[i].phone,
              tax: this.customerList[i].tax,
              remark: remark,
              discount: discount
            }
            this.customerSelect = this.customerList[i].name
          }
        }
      this.editedItem = myItems
      this.totalList = myItems.length
      },
      calTotal (items,discount) {
        var total = 0
        var i
        for(i = 0;i<items.length;i++){
          total += items[i].quantity * items[i].price
        }
        discount = discount / 100
        total -= Math.round(total*discount)
        return total
      },
      deleteItem(key){
        confirm('ต้องการลบรายการนี้ใช่หรือไม่') && 
        firebase.database().ref("SellOrders/" + key).remove().then( () => {
          this.dialog2 = true
        })
      }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'เพิ่มรายการไหม่' : 'แก้ไขรายการ'
    },
  },
  watch: {
    customerSelect: function () {
      var i = 0
      for(i;i<this.customerList.length;i++){
        if(this.customerList[i].name == this.customerSelect){
          this.customerDetail = {
            key: this.customerList[i].key,
            name: this.customerList[i].name,
            address: this.customerList[i].address,
            phone: this.customerList[i].phone,
            tax: this.customerList[i].tax,
            remark: this.customerDetail.remark,
            discount: this.customerDetail.discount
          }
        }
      }
    },
    editedItem: {
    	deep: true,
        handler: function () {
          this.total = 0
          var i
          for(i = 0;i<this.editedItem.length;i++){
            this.total += this.editedItem[i].quantity * this.editedItem[i].price
          }
        }
    },
    customerDetail: {
    	deep: true,
        handler: function () {
          this.total = 0
          var i
          for(i = 0;i<this.editedItem.length;i++){
            this.total += this.editedItem[i].quantity * this.editedItem[i].price
          } 
          var discount = this.customerDetail.discount / 100
          this.total -= Math.round(this.total*discount)
        }
    }
  }
}
</script>