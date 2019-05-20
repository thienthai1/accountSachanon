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
            <td class="text-xs-left">{{ props.item.price }}</td>
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
        <h3 style="text-decoration: underline;" class="mr-3 text-xs-right mt-2">รวมทั้งหมด</h3>
        <h3 class="green--text mr-3 text-xs-right mt-2">เงินสด: {{ totalCash }} บาท</h3>
        <h3 class="blue--text mr-3 text-xs-right mt-2">เช็ค: {{ totalCheck }} บาท</h3>
        <h3 class="yellow--text mr-3 text-xs-right mt-2">บัตรเครดิต/เดบิต: {{ totalCard }} บาท</h3>
        <h3 class="pink--text mr-3 text-xs-right mt-2">โอน: {{ totalTransfer }} บาท</h3>
        <v-dialog
            v-model="showPicDia"
            width="100%"
        >
            <v-card>
            <v-card-text class="justify-center" >
                <img :src=receiptPic />
            </v-card-text>
            <v-card-actions>
                <v-btn
                color="green darken-1"
                flat="flat"
                @click="showPicDia = false"
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
import { parse } from 'path';
  export default {
    data () {
      return {
        
        receiptPic: "",
        showPicDia: false,
        date: new Date().toISOString().substr(0, 10),
        menu2: false,
        menu3: false,
        date2: new Date().toISOString().substr(0, 10),
        myDate: "this is my date",
        totalCash: 0,
        totalCheck: 0,
        totalCard: 0,
        totalTransfer: 0,
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
        this.totalCash = 0
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
                    type: this.previewType(childSnapshot.val().type),
                    key: childSnapshot.key,
                    url: childSnapshot.val().url      
                }
                if(childSnapshot.val().date == nowDate){
                    items.push(jsAccn)
                    // this.totalCash += parseInt(childSnapshot.val().price)
                    this.calTotal(childSnapshot.val().type,parseInt(childSnapshot.val().price))
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
            if( year >= parseInt(this.formatDate2().substr(6))  && year <= parseInt(this.formatDate().substr(6)) ){
                if( month >= parseInt(this.formatDate2().substr(3,2))  && month <= parseInt(this.formatDate().substr(3,2)) ){
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
            }else{
            return "โอน"
            }
        },
        calTotal(type,money){
            if(type == "cash"){
                this.totalCash+=money
            }else if(type == "check"){
                this.totalCheck+=money
            }else if(type == "card"){
                this.totalCard+=money
            }else if(type == "transfer"){
                this.totalTransfer+=money
            }
        }
    },
    watch: {
        date2: function () {
            var readRef = firebase.database().ref("Outin")
            var nowDate = this.formatDate()
            // alert(nowDate)
            var items = []
            this.totalCash = 0
            var jsAccn = {
                date: "",
                name: "",
                price: "",
                remark: "",
                time: "",
                type: "",
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
                            type: this.previewType(childSnapshot.val().type),
                            key: childSnapshot.key      
                        }
                        if(this.dateCheck(childSnapshot.val().date)){
                            items.push(jsAccn)
                            // this.totalCash += parseInt(childSnapshot.val().price)
                            this.calTotal(childSnapshot.val().type,parseInt(childSnapshot.val().price))
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
            this.totalCash = 0
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
                        if(this.dateCheck(childSnapshot.val().date)){
                            items.push(jsAccn)
                            // this.totalCash += parseInt(childSnapshot.val().price)
                            this.calTotal(childSnapshot.val().type,parseInt(childSnapshot.val().price))
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