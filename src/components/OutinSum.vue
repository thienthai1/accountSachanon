<template>
    <v-container>
        <h1>สรุปยอดรายรับรายจ่าย</h1>
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
                v-model="date"
                prepend-icon="event"
                readonly
                v-on="on"
            ></v-text-field>
            </template>
            <v-date-picker v-model="date" @input="menu2 = false">
                
            </v-date-picker>
        </v-menu>
        <p>{{ formatDate() }}</p>
        <v-divider class="my-2"></v-divider>
        <v-data-table
            :headers="headers"
            :items="myData"
            class="elevation-1"
            hide-actions
        >
            <template v-slot:items="props">
            <td class="text-xs-left">{{ props.item.time }}</td>
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.price }}</td>
            <td class="text-xs-left">{{ props.item.remark }}</td>
            </template>

        </v-data-table>
        <v-divider class="my-3"></v-divider>
        <h3 style="text-decoration: underline;" class="mr-3 text-xs-right mt-2">รวมทั้งหมด: {{ sum }} บาท</h3>
    </v-container>
</template>

<script>
  export default {
    data () {
      return {
        date: new Date().toISOString().substr(0, 10),
        menu2: false,
        sum: 0,
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
            { text: '', sortable: false}
        ]
      }
    },
    methods: {
        formatDate () {
            return this.date.substr(8,2)+"/"+this.date.substr(5,2)+"/"+this.date.substr(0,4)
        } 
    }
  }
</script>