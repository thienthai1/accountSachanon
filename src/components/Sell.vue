<template>
    <v-container>
      <h1>รายการขาย</h1>
  <span>{{ n }} </span>
</div>
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
                <v-layout wrap v-for="n in totalList">
                  <v-flex xs12 sm4 md4 style="padding-top=3px">
                    <select
                      label="รายการสินค้า"
                    >
                    
                    <!-- <optgroup  v-for="option in options" v-bind:label="option">
                      <option v-for="sub in option" v-bind:value="option.value">{{sub.text}}</option>
                    </optgroup> -->
                      <optgroup label="Swedish Cars">
                        <option value="volvo">Volvo</option>
                        <option value="saab">Saab</option>
                      </optgroup>
                      <optgroup label="German Cars">
                        <option value="mercedes">Mercedes</option>
                        <option value="audi">Audi</option>
                      </optgroup>
                    
                    </select>
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
                      <v-btn @click="addItem()" flat color="green">
                        เพิ่มรายการ
                      </v-btn>
                      <v-btn @click="removeItem()" flat color="red">
                        ลดรายการ
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

<script>
  export default {
  name: 'Sell',
  data () {
    return {
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
        }
    }
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
  },
}
</script>