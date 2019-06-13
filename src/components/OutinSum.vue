<template>
    <v-container>
        <h1>สรุปยอดรายรับรายจ่าย</h1>
        <v-divider class="my-3"></v-divider>
        <v-layout row wrap>
            <v-flex xs12 lg3>
                <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                    <v-text-field
                        v-model="date2"
                        prepend-icon="event"
                        label="เริ่มจาก"
                        readonly
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker v-model="date2" @input="menu2 = false">
                        
                    </v-date-picker>
                </v-menu>
            </v-flex>
            <v-flex xs12 lg3>
                <v-menu
                v-model="menu3"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                    <v-text-field
                        label="จนถึงวันที่"
                        v-model="date"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker v-model="date" @input="menu3 = false">
                        
                    </v-date-picker>
                </v-menu>
            </v-flex>
        </v-layout>
        <!-- <p>{{ formatDate() }}</p>
        <p>{{ formatDate2() }}</p> -->
        <v-data-table
            :headers="headers"
            :items="myData"
            class="elevation-1"
            hide-actions
        >
            <template v-slot:items="props">
            <td>{{ props.item.date }}</td>
            <td class="text-xs-left">{{ props.item.time }}</td>
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td :class="dealStatus(props.item.status,props.item.type)" class="text-xs-left">{{ formatPrice(props.item.price) }}</td>
            <td class="text-xs-left">{{ props.item.type }}</td>
            <td class="text-xs-left">{{ props.item.remark }}</td>
          <td class="text-xs-left">
            <v-icon
              small
              class="mr-2"
              @click="openPic(props.item.url)"
              v-ripple
            >
              image
            </v-icon>
          </td>
            </template>

        </v-data-table>
        <v-divider class="my-3"></v-divider>
        <h3 style="text-decoration: underline;" class="mr-3 text-xs-right mt-2">จ่ายทั้งหมด</h3>
        <h3 class="green--text mr-3 text-xs-right mt-2">จ่ายเงินสด: {{ totalOutCash }} บาท</h3>
        <h3 class="blue--text mr-3 text-xs-right mt-2">จ่ายเช็ค: {{ totalOutCheck }} บาท</h3>
        <h3 class="yellow--text mr-3 text-xs-right mt-2">จ่ายบัตรเครดิต/เดบิต: {{ totalOutCard }} บาท</h3>
        <h3 class="pink--text mr-3 text-xs-right mt-2">จ่ายโอน: {{ totalOutTransfer }} บาท</h3>
        <h3 class="white--text mr-3 text-xs-right mt-2">หนี้: {{ outDebt }} บาท</h3>
        <v-divider class="my-3"></v-divider>
        <h3 style="text-decoration: underline;" class="mr-3 text-xs-right mt-2">รับทั้งหมด</h3>
        <h3 class="green--text mr-3 text-xs-right mt-2">รับเงินสด: {{ totalInCash }} บาท</h3>
        <h3 class="blue--text mr-3 text-xs-right mt-2">รับช็ค: {{ totalInCheck }} บาท</h3>
        <h3 class="yellow--text mr-3 text-xs-right mt-2">รับบัตรเครดิต/เดบิต: {{ totalInCard }} บาท</h3>
        <h3 class="pink--text mr-3 text-xs-right mt-2">รับโอน: {{ totalInTransfer }} บาท</h3>
        <h3 class="white--text mr-3 text-xs-right mt-2">หนี้: {{ inDebt }} บาท</h3>
        <v-divider class="my-3"></v-divider>
        <h3 class="white--text mr-3 text-xs-right mt-2">เหลือเงินสด: {{ formatPrice(remainCash) }} บาท</h3>
        <v-dialog
            v-model="showPicDia"
            max-width="800px"
        >
        <v-layout justify-center>
            <v-flex>
            <v-card max-width="800px">
                        <img :src=receiptPic />
                        <v-card-actions>
                        <v-btn
                            color="green darken-1"
                            @click="showPicDia = false"
                        >
                            ตกลง
                        </v-btn>
                        </v-card-actions> 
            </v-card>
            </v-flex>
            </v-layout>
        </v-dialog>
    </v-container>
</template>

<script>
import firebase from '../firebase'
import { parse } from 'path';
  export default {
    data () {
      return {
        inDebt: 0,
        outDebt: 0,
        remainCash: 0,
        receiptPic: "",
        showPicDia: false,
        date: new Date().toISOString().substr(0, 10),
        menu2: false,
        menu3: false,
        date2: new Date().toISOString().substr(0, 10),
        myDate: "this is my date",
        totalInCash: 0,
        totalInCheck: 0,
        totalInCard: 0,
        totalInTransfer: 0,
        totalOutCash: 0,
        totalOutCheck: 0,
        totalOutCard: 0,
        totalOutTransfer: 0,
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
            { text: 'ประเภท', value: 'type', sortable: false},
            { text: 'หมายเหตุ', value: 'remark', sortable: false },
            { text: '', sortable: false}
        ]
      }
    },
    mounted: function () {
        var readRef = firebase.database().ref("Outin")
        var nowDate = this.formatDate()
        // alert(nowDate)
        var items = []
        this.totalInCash = 0
        var jsAccn = {
            date: "",
            name: "",
            price: "",
            remark: "",
            time: "",
            key: "",
            status: "",
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
                    type: this.previewType(childSnapshot.val().type),
                    key: childSnapshot.key,
                    url: childSnapshot.val().url,
                    status: childSnapshot.val().status      
                }
                if(childSnapshot.val().date == nowDate){
                    items.push(jsAccn)
                    // this.totalInCash += parseInt(childSnapshot.val().price)
                    this.calTotal(childSnapshot.val().type,parseInt(childSnapshot.val().price),childSnapshot.val().status)
                    this.myData = items
                }
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
        formatDate () {
            var year = parseInt(this.date.substr(0,4))
            var chng = year + 543
            return this.date.substr(8,2)+"/"+this.date.substr(5,2)+"/"+String(chng)
        },
        formatDate2 () {
            var year = parseInt(this.date.substr(0,4))
            var chng = year + 543
            return this.date2.substr(8,2)+"/"+this.date2.substr(5,2)+"/"+String(chng)
        },
        dateCheck (myDate) {
            //console.log("checking...")
            var day = parseInt(myDate.substr(0,2))
            var month = parseInt(myDate.substr(3,2))
            var year = parseInt(myDate.substr(6))

            if(parseInt(this.formatDate2().substr(6)) < parseInt(this.formatDate().substr(6))){
                if(month >= parseInt(this.formatDate2().substr(3,2)) && year < parseInt(this.formatDate().substr(6))){
                    return true
                }else if(month <= parseInt(this.formatDate().substr(3,2)) && year == parseInt(this.formatDate().substr(6))){
                    return true
                }  
            }

            if(parseInt(this.formatDate2().substr(3,2)) < parseInt(this.formatDate().substr(3,2))){
                if(day >= parseInt(this.formatDate2().substr(0,2)) && month < parseInt(this.formatDate().substr(3,2))){
                    return true
                }else if(day <= parseInt(this.formatDate().substr(0,2)) && month == parseInt(this.formatDate().substr(3,2))){
                    return true
                }
            }

            if(parseInt(this.formatDate2().substr(3,2)) == parseInt(this.formatDate().substr(3,2))){
                if(month ==  parseInt(this.formatDate().substr(3,2))){
                    if( day >= parseInt(this.formatDate2().substr(0,2))  && day <= parseInt(this.formatDate().substr(0,2)) ){
                        return true
                    }
                }            
            }

            return false
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
        calTotal(type,money,status){
            if(status == "outcome"){
                if(type == "cash"){
                    this.totalOutCash+=money
                }else if(type == "check"){
                    this.totalOutCheck+=money
                }else if(type == "card"){
                    this.totalOutCard+=money
                }else if(type == "transfer"){
                    this.totalOutTransfer+=money
                }else if(type == "debt"){
                    this.outDebt += money
                }
            }else if(status == "income"){
                if(type == "cash"){
                    this.totalInCash+=money
                }else if(type == "check"){
                    this.totalInCheck+=money
                }else if(type == "card"){
                    this.totalInCard+=money
                }else if(type == "transfer"){
                    this.totalInTransfer+=money
                }else if(type == "debt"){
                    this.inDebt += money
                }
            }
            this.remainCash = this.totalInCash - this.totalOutCash 
        },
        formatPrice(price){
            var p = price
            return p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        },
        resetNumber(){
            this.totalInCash = 0,
            this.totalInCheck = 0,
            this.totalInCard = 0,
            this.totalInTransfer = 0,
            this.totalOutCash = 0,
            this.totalOutCheck = 0,
            this.totalOutCard = 0,
            this.totalOutTransfer = 0,
            this.inDebt = 0,
            this.outDebt = 0
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
    watch: {
        date2: function () {
            var readRef = firebase.database().ref("Outin")
            var nowDate = this.formatDate()
            // alert(nowDate)
            var items = []
            // this.totalInCash = 0
            // this.inDebt = 0
            // this.outDebt = 0
            this.resetNumber()
            var jsAccn = {
                date: "",
                name: "",
                price: "",
                remark: "",
                time: "",
                type: "",
                key: "",
                status: "",
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
                            type: this.previewType(childSnapshot.val().type),
                            key: childSnapshot.key,
                            status: childSnapshot.val().status,
                            url: childSnapshot.val().url      
                        }
                        if(this.dateCheck(childSnapshot.val().date)){
                            items.push(jsAccn)
                            // this.totalInCash += parseInt(childSnapshot.val().price)
                            this.calTotal(childSnapshot.val().type,parseInt(childSnapshot.val().price),childSnapshot.val().status)
                            this.myData = items
                        }
                    });
                    sortItems = []
                    var j = items.length-1
                    for(;j>=0;j--){
                        sortItems.push(items[j])
                    }
                    this.myData = sortItems
                });
        },
        date: function () {
            var readRef = firebase.database().ref("Outin")
            var nowDate = this.formatDate()
            // alert(nowDate)
            var items = []
            // this.totalInCash = 0
            // this.inDebt = 0
            // this.outDebt = 0
            this.resetNumber()
            var jsAccn = {
                date: "",
                name: "",
                price: "",
                remark: "",
                time: "",
                key: "",
                type: "",
                status: ""
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
                            type: this.previewType(childSnapshot.val().type),
                            key: childSnapshot.key,
                            status: childSnapshot.val().status,
                            url: childSnapshot.val().url,       
                        }
                        if(this.dateCheck(childSnapshot.val().date)){
                            items.push(jsAccn)
                            // this.totalInCash += parseInt(childSnapshot.val().price)
                            this.calTotal(childSnapshot.val().type,parseInt(childSnapshot.val().price),childSnapshot.val().status)
                            this.myData = items
                        }
                    });
                    sortItems = []
                    var j = items.length-1
                    for(;j>=0;j--){
                        sortItems.push(items[j])
                    }
                    this.myData = sortItems
                });
        },
        
    }
  }
</script>