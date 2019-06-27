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
          <td class="text-xs-left">{{ props.item.total }} ฿</td>
          <td class="text-xs-left">

            <v-icon
              small
              class="mr-2"
              @click="printer (props.item.key,props.item.myitems,props.item.keyCustomer,props.item.remark,props.item.discount,props.item.vat,props.item.date)"
              v-ripple
            >
              print
            </v-icon>
            <v-icon
              small
              class="mr-2"
              @click="editItem(props.item.key,props.item.myitems,props.item.keyCustomer,props.item.remark,props.item.discount,props.item.vat)"
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
       for(i = 0;i<16;i++){
         if(i == 0){
            this.dataItems.push({header: "ผ้าเช็ดมือ"})
         }else if(i == 1){
            this.dataItems.push({header: "ผ้าเช็ดหน้า"})
         }else if(i == 2){
            this.dataItems.push({header: "ผ้าอเนกประสงค์"})          
         }else if(i == 3){
            this.dataItems.push({header: "ผ้าเช็ดตัว"})           
         }else if(i == 4){
            this.dataItems.push({header: "ผ้าเช็ดเท้า"})           
         }else if(i == 5){
            this.dataItems.push({header: "ผ้าหลา"})           
         }else if(i == 6){
            this.dataItems.push({header: "ผ้าห่ม"})           
         }else if(i == 7){
            this.dataItems.push({header: "ผ้าเช็ดผม"})           
         }else if(i == 8){
            this.dataItems.push({header: "ผ้าเย็น"})           
         }else if(i == 9){
            this.dataItems.push({header: "ผ้าปู"})           
         }else if(i == 10){
            this.dataItems.push({header: "ปลอกหมอน"})           
         }else if(i == 11){
            this.dataItems.push({header: "ปลอกหมอนข้าง"})           
         }else if(i == 12){
            this.dataItems.push({header: "ปลอกผ้านวม"})           
         }else if(i == 13){
            this.dataItems.push({header: "ใส้ผ้านวม"})           
         }else if(i == 14){
            this.dataItems.push({header: "เสื้อคลุม"})           
         }else if(i == 15){
            this.dataItems.push({header: "รองเท้า"})           
         }
      //  itemType: [
      //    'ผ้าเช็ดมือ', 
      //    'ผ้าเช็ดหน้า', 
      //    'ผ้าอเนกประสงค์', 
      //    'ผ้าเช็ดตัว',
      //    'ผ้าเช็ดเท้า',
      //    'ผ้าหลา',
      //    'ผ้าห่ม',
      //    'ผ้าเช็ดผม',
      //    'ผ้าเย็น',
      //    'ผ้าปู',
      //    'ปลอกหมอน',
      //    'ปลอกหมอนข้าง',
      //    'ปลอกผ้านวม',
      //    'ใส้ผ้านวม',
      //    'เสื้อคลุม',
      //    'รองเท้า'
      //    ],
         for(j = 0;j < this.stocksItem.length;j++){
           if(i == 0){
             if(this.stocksItem[j].type == "ผ้าเช็ดมือ"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price,key: this.stocksItem[j].key})
             }
           }else if(i == 1){
             if(this.stocksItem[j].type == "ผ้าเช็ดหน้า"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price,key: this.stocksItem[j].key})
             } 
           }else if(i == 2){
             if(this.stocksItem[j].type == "ผ้าอเนกประสงค์"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price,key: this.stocksItem[j].key})
             } 
           }else if(i == 3){
             if(this.stocksItem[j].type == "ผ้าเช็ดตัว"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price,key: this.stocksItem[j].key})
             } 
           }else if(i == 4){
             if(this.stocksItem[j].type == "ผ้าเช็ดเท้า"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price,key: this.stocksItem[j].key})
             } 
           }else if(i == 5){
             if(this.stocksItem[j].type == "ผ้าหลา"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price,key: this.stocksItem[j].key})
             } 
           }else if(i == 6){
             if(this.stocksItem[j].type == "ผ้าห่ม"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price,key: this.stocksItem[j].key})
             } 
           }else if(i == 7){
             if(this.stocksItem[j].type == "ผ้าเช็ดผม"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price,key: this.stocksItem[j].key})
             } 
           }else if(i == 8){
             if(this.stocksItem[j].type == "ผ้าเย็น"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price,key: this.stocksItem[j].key})
             } 
           }else if(i == 9){
             if(this.stocksItem[j].type == "ผ้าปู"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price,key: this.stocksItem[j].key})
             } 
           }else if(i == 10){
             if(this.stocksItem[j].type == "ปลอกหมอน"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price,key: this.stocksItem[j].key})
             } 
           }else if(i == 11){
             if(this.stocksItem[j].type == "ปลอกหมอนข้าง"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price,key: this.stocksItem[j].key})
             } 
           }else if(i == 12){
             if(this.stocksItem[j].type == "ปลอกผ้านวม"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price,key: this.stocksItem[j].key})
             } 
           }else if(i == 13){
             if(this.stocksItem[j].type == "ใส้ผ้านวม"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price,key: this.stocksItem[j].key})
             } 
           }else if(i == 14){
             if(this.stocksItem[j].type == "เสื้อคลุม"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price,key: this.stocksItem[j].key})
             } 
           }else if(i == 15){
             if(this.stocksItem[j].type == "รองเท้า"){
               this.dataItems.push({name: this.stocksItem[j].products,price: this.stocksItem[j].price,key: this.stocksItem[j].key})
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

    readRef = firebase.database().ref("Quotation")
    var jsAccn = {
          key: "",
          name: "",
          phone: "",
          tax: "",
          address: "",
          date: "",
          myitems: "",
          remark: "",
          discount: "",
          vat: ""     
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
          total: this.calTotal(childSnapshot.val().items,childSnapshot.val().discount,childSnapshot.val().vat),
          remark: childSnapshot.val().remark,
          discount: childSnapshot.val().discount,
          vat: childSnapshot.val().vat   
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
        getBase64Image(url) {
            // // Create an empty canvas element
            // var canvas = document.createElement("canvas");
            // canvas.width = img.width;
            // canvas.height = img.height;

            // // Copy the image contents to the canvas
            // var ctx = canvas.getContext("2d");
            // ctx.drawImage(img, 0, 0);

            // // Get the data-URL formatted image
            // // Firefox supports PNG and JPEG. You could check img.src to
            // // guess the original format, but be aware the using "image/jpg"
            // // will re-encode the image.
            // var dataURL = canvas.toDataURL("image/png");


            // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
            var img = new Image();

            img.setAttribute('crossOrigin', 'anonymous');

            img.onload = function () {
                var canvas = document.createElement("canvas");
                canvas.width =this.width;
                canvas.height =this.height;

                var ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0);

                var dataURL = canvas.toDataURL("image/png");

                alert(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
            };

            img.src = url;
      },
      printer (index,items,key,remark,discount,vat,date) {
            var pdfMake = require('pdfmake/build/pdfmake.js');
            var pdfFonts = require('pdfmake/build/vfs_fonts.js');
            pdfMake.vfs = pdfFonts.pdfMake.vfs;
            // var x = document.createElement("IMG");
            // x.setAttribute("src","../assets/logo.png")
            // var dataImg = this.getBase64Image(x)
            //var dataImg = this.getBase64Image("logo.png")

            var customerDetail = {
                key: '',
                name: '',
                phone: '',
                address: '',
                tax: '',
                remark: '',
                discount: '',
                vat: ''
              }
            
            var i = 0
            for(i;i<this.customerList.length;i++){
              if(this.customerList[i].key == key){
                customerDetail = {
                  key: this.customerList[i].key,
                  name: this.customerList[i].name,
                  address: this.customerList[i].address,
                  phone: this.customerList[i].phone,
                  tax: this.customerList[i].tax,
                  remark: remark,
                  discount: discount,
                  vat: vat
                }
              }
            }

            var listProd = items
            console.log(listProd)

            var discount = 3
            var vat = 50
            var total = 0

            var columnKeep = []
            var rowKeep = []
            var i,j;
            rowKeep.push([
                  {text: 'ลำดับ', bold: 'true', style: 'tableHeader',alignment: 'center'}, 
                  {text: 'รายการ', bold: 'true', style: 'tableHeader'}, 
                  {text: 'จำนวน', bold: 'true', style: 'tableHeader',alignment: 'center'}, 
                  {text: 'หน่วยละ', bold: 'true', style: 'tableHeader',alignment:'center'},
                  {text: 'จำนวนเงิน', bold: 'true', style: 'tableHeader',alignment: 'center'}
            ])
            for(i = 0;i<listProd.length;i++){
                for(j = 0;j<5;j++){
                    if(j == 0){
                      columnKeep.push({
                        text: i+1,
                        fontSize:10,
                        alignment:"center"
                      })
                    }else if(j == 1){
                      columnKeep.push({
                        text: listProd[i].name,
                        fontSize:10
                      })         
                    }else if(j == 2){
                      columnKeep.push({
                        text: listProd[i].quantity,
                        fontSize:10,
                        alignment:"center"
                      })  
                    }else if(j == 3){
                      columnKeep.push({
                        text: listProd[i].price + " บาท",
                        fontSize:10,
                        alignment:"center"
                      })
                      console.log(total)
                    }else if(j == 4){
                      columnKeep.push({
                        text: listProd[i].price * listProd[i].quantity + " บาท",
                        fontSize:10,
                        alignment: 'center'
                      })
                      total += listProd[i].price * listProd[i].quantity
                    }
                }
              rowKeep.push(columnKeep)
              columnKeep = []
            }

            console.log(rowKeep)
            var myDis = (customerDetail.discount/100) * total
            var myVat = (customerDetail.vat/100) * total
            var totalPrice = Math.round(total + myVat - myDis)
            // totalPrice -= - ((discount/100)*total)

            var dd = {
              footer: [
                {
                  margin: [0,50,0,90],
                  columns: [
                    { 
                      margin:[50,-60,0,0],
                      text: 'ผู้ซื้อ: _____________  \nตกลงตามรายการข้างต้น'
                    },
                    { 
                      text: ['ขอแสดงความนับถือ \n', {text: '   ษาชานนท์เทคไทลล์',margin:[30,20,20,20]}],
                      margin:[120,-60,0,0],
                    }
                  ],
                },
                {
                  margin:[50,-1,0,20],
                  fontSize: "10",
                  width: 200,
                  text: "- หากสินค้าเสียหายหรือขาดจำนวนต้องแจ้งเป็นลายลักษณ์อักษรให้บริษัทฯทราบภายใน 7 วันนับจากวันที่ได้รับสินค้ามิฉะนั้นบริษัทฯจะถือว่าผู้ซื้อได้รับสินค้าถูกต้องเรียบร้อยแล้วตามที่ระบุไว้ในเอกสารนี้"
                }
              ],
              content: [
                {
                  columns: [
                    // {
                      
                    //   image: "data:image/png;base64," + dataImg,
                    //   width: 100,
                    //   height: 100,
                      
                    // },
                    [
                        {
                          text: "ษาชานนท์ เทคไทลล์", 
                          style: 'header',
                          margin: [10,0,0,0]
                        },
                        {
                          text: '99/414 หมู่ที่ 8 ตำบลนาเกลือ อำเถอพระสมุทรเจดีย์ จังหวัดสมุทรปราการ 10290', 
                          style: 'subheader',
                          margin: [10,3,0,0],
                        },
                        {
                          text: 'Tel: 089-788-5439', 
                          style: 'subheader',
                          margin: [10,3,0,0],
                        },
                    ]         
                  ],
                },
                {
                  columns: [
                    {
                      
                      text: "เลขที่ผู้เสียภาษี: " + customerDetail.tax,
                      margin: [0,10,0,0],
                      fontSize: 11,
                      decoration: 'underline'
                    },
                    {
                      text: "ใบเสนอราคา",
                      fontSize: 13,
                      margin: [60,7,0,0],
                      decoration: 'underline',
                      bold: 'true'
                    },
                    [
                      {
                        text: "Ref No: " + index,
                        margin: [60,0,0,0],
                        fontSize: 10,
                        decoration: 'underline'
                      },
                      {
                        text: "วันที่: " + date,
                        margin: [60,3,0,0],
                        fontSize: 10,
                        decoration: 'underline'
                      },
                    ]       
                  ],
                },
                [
                  {
                    margin: [0,10,0,0],
                    text: "ชื่อ-นามสกุล: " + customerDetail.name,
                    fontSize: 10,
                    decoration: 'underline'
                  },
                  {
                    columns: [
                      {
                        margin: [0,2,0,0],
                        text: "ที่อยู่: " + customerDetail.address,
                        decoration: 'underline',
                        fontSize: 10,
                        width: 280 
                      },
                    ]
                  },
                  {
                    margin: [0,2,0,0],
                    text: "เบอร์โทร: " + customerDetail.phone,
                    fontSize: 10,
                    decoration: 'underline'
                  },
                ],
                {
                  margin: [0,20,0,12],
                  style: 'tableExample',
                  table: {
                      widths: [50, 160, 50, 50, 153],
                      body: rowKeep,
                  },
                  layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                      return (rowIndex % 2 === 0) ? '#eeeeff' : null;
                    }
                  }
                },
                {
                  columns: [
                    {
                      margin: [0,5,0,0],
                      text: "หมายเหตุ: " + customerDetail.remark,
                      fontSize: 11
                    },
                    [
                      {
                        text: "ส่วนลด: " + customerDetail.discount + "%",
                        alignment: 'right',
                        fontSize: 11,
                        bold: 'true',
                        decoration: 'underline',
                        margin: [5,0,7,3],
                      },
                      {
                        text: "ภาษี: " + customerDetail.vat + "%",
                        alignment: 'right',
                        fontSize: 11,
                        bold: 'true',
                        decoration: 'underline',
                        margin: [0,0,7,3],
                      },
                      {
                        text: "รวม: " + totalPrice + " บาท",
                        alignment: 'right',
                        fontSize: 11,
                        bold: 'true',
                        decoration: 'underline',
                        margin: [0,0,7,0],
                      }
                    ]
                  ]
                },
              ],
              styles: {
                header: {
                  fontSize: 14,
                  bold: true,
                },
                subheader: {
                  fontSize: 10,
                  bold: false
                },
                quote: {
                  italics: true
                },
                small: {
                  fontSize: 8
                }
              },
              defaultStyle: {
                font: 'Kanit'
              }
            }

            let fonts = {
              Kanit: {
                normal: 'Kanit-Regular.ttf',
                bold: 'Kanit-Bold.ttf',
                italics: 'Kanit-Light.ttf',
                bolditalics: 'Kanit-ExtraLight.ttf'
            }
            }
            pdfMake.createPdf(dd,null,fonts).open();
      },
      pushDB () {
        if(this.editedIndex == -1){
              var readRef = firebase.database().ref("Quotation")
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
                discount: this.customerDetail.discount,
                vat: this.customerDetail.vat
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
                discount: '',
                vat: ''
              }
              this.editedItem[0].quantity = ''
              this.editedItem[0].type = ''
              this.editedItem[0].price = ''
        }else{
              var readRef = firebase.database().ref("Quotation/"+this.editedIndex)
              readRef.update({
                items: this.editedItem,
                remark: this.customerDetail.remark,
                discount: this.customerDetail.discount,
                vat: this.customerDetail.vat
              })
              this.dialog = false
              this.dialog2 = true
              this.customerDetail = {
                key: '',
                name: '',
                phone: '',
                address: '',
                tax: '',
                discount: '',
                vat: ''
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
          discount: '',
          vat: '',
          remark: ''
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
      editItem (item,myItems,key,remark,discount,vat) {
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
              discount: discount,
              vat: vat
            }
            this.customerSelect = this.customerList[i].name
          }
        }
      this.editedItem = myItems
      this.totalList = myItems.length
      },
      calTotal (items,discount,vat) {
        var total = 0
        var i
        for(i = 0;i<items.length;i++){
          total += items[i].quantity * items[i].price
        }
        discount = (discount / 100) * total
        vat = (vat / 100) * total
        return Math.round(total + vat - discount)
      },
      deleteItem(key){
        confirm('ต้องการลบรายการนี้ใช่หรือไม่') && 
        firebase.database().ref("Quotation/" + key).remove().then( () => {
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
      console.log(this.customerDetail)
      var i = 0
      for(i;i<this.customerList.length;i++){
        if(this.customerList[i].name == this.customerSelect){
          // this.customerDetail = {
          //   key: this.customerList[i].key,
          //   name: this.customerList[i].name,
          //   address: this.customerList[i].address,
          //   phone: this.customerList[i].phone,
          //   tax: this.customerList[i].tax,
          //   // remark: this.customerDetail.remark,
          //   // discount: this.customerDetail.discount,
          //   // vat: this.customerDetail.vat
          // }
          this.customerDetail.key = this.customerList[i].key
          this.customerDetail.name = this.customerList[i].name
          this.customerDetail.address = this.customerList[i].address
          this.customerDetail.phone = this.customerList[i].phone
          this.customerDetail.tax = this.customerList[i].tax
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
          var discount = (this.customerDetail.discount / 100) * this.total
          var vat = (this.customerDetail.vat / 100) * this.total
          this.total = Math.round(this.total - discount + vat)
        }
    }
  }
}
</script>