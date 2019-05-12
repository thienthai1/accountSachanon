<template>
  <v-app v-if="!isLogin">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>ล็อกอิน</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <span>Source</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field v-model="usname" prepend-icon="person" name="login" label="Login" type="text"></v-text-field>
                  <v-text-field v-model="passwrd" prepend-icon="lock" name="password" label="Password" id="password" type="password"></v-text-field>
                  <p class="red--text">{{ errmsg }}</p>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="login(usname,passwrd,errmsg,isLogin)" color="primary">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
  </v-app>
  <v-app v-else>
  <v-navigation-drawer
      v-model="drawer"
      permanent
      absolute
      app clipped-left
    >
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="http://clipart-library.com/images/rTjK5j9yc.png">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>รายงานบัญชี</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile
          v-for="item in items"
          :key="item.title"
          @click=""
        >

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
    </v-navigation-drawer>
    <v-content>
      <router-view>
      </router-view>
    </v-content>
  </v-app>
</template>

<script>
import firebase from './firebase'

export default {
  name: 'App',
  data () {
    return {
        isLogin:false,
        errmsg:'',
        usname:'',
        passwrd:'',
        items: [
        { title: 'รายรับรายจ่าย'},
        { title: 'ยอดซื้อ'},
        { title: 'ยอดขาย'},
        { title: 'สต๊อกสินค้า'},
        { title: 'รายงาน'},
        { title: 'ออกจากระบบ'}
      ],
    }
  },
  methods: {
    login: function(usname,passwrd) {
      var readRef = firebase.database().ref('/members/' + usname + '/password/');
      var loginfunc = this.loginfunc
      this.$router.push({path:'/home', query: {usr:usname} })
      readRef.on('value', function(snapshot) {
              loginfunc(snapshot.val(),passwrd,usname)
      })
    },
    wait: function() {
        this.errmsg = "* wrong username or password"
    },
    loginfunc: function(data,passwrd,usname) {
            if(data == passwrd && passwrd != null){
                this.isLogin = true
                this.$router.push({path:'/home', query: {usr:usname} })
            }else{
                this.errmsg = "* wrong username or password"
            }
    }
  },
  created () {
    if(this.$route.query.usr!=null){
      this.isLogin = true
    }
  }
}
</script>
