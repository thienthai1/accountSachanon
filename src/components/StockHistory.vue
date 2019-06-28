<template>
    <div>
      <v-data-table
        :pagination.sync="pagination"
        :headers="headers"
        :items="myData"
        class="elevation-1"
        expand = "true"
      >
        <template v-slot:items="props">
          <td class="text-xs-left">{{ props.item.date }}</td>
          <td class="text-xs-left">{{ props.item.product }}</td>
          <td class="text-xs-left">{{ props.item.type }}</td>
          <td class="text-xs-left">{{ props.item.quantity }} ฿</td>
        </template>
      </v-data-table>
    </div>
</template>

<script>
export default {
    name: 'StockHis',
  data () {
    return {
      myData: [],
      headers: [
        {
          text: 'วันที่',
          value: 'date',
          sortable: false
        },
        { text: 'สินค้า', value: 'product',sortable: false },
        { text: 'ชนิด', value: 'type',sortable: false },
        { text: 'จำนวน', value: 'quantity',sortable: false },
        { text: '', sortable: false }
      ]
    }
  }
}
</script>