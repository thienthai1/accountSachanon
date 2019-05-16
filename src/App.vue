<template>
  <v-app dark v-if="!isLogin">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="grey darken-3">
                <v-toolbar-title>Login</v-toolbar-title>
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
                <v-btn @click="login(usname,passwrd,errmsg,isLogin)" color="green darken-3">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
  </v-app>
  <v-app v-else dark>
  <v-navigation-drawer
      v-model="drawer"
      permanent
      absolute
      app clipped-left
      dark
    >
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="http://clipart-library.com/images/rTjK5j9yc.png">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ userLogin }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list
        v-for="item in items"
        :key="item.title"
      >
          <template v-if='!item.drop'>
              <v-list-tile v-ripple @click="link(item.url)">
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile>
          </template>
          <template v-else>
              <v-list-group  value="false">
                <template v-slot:activator>
                    <v-list-tile>
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile>
                </template>
                  <v-list-tile 
                    @click=""
                    v-for="k in item.subt"
                    :key="k.subtitle"
                    v-ripple
                   >
                    <v-list-tile-action>
                    </v-list-tile-action>
                    <v-list-tile-title>{{ k.subtitle }}</v-list-tile-title>
                  </v-list-tile>
              </v-list-group>
          </template>
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
        userLogin: "",  
        isLogin: false,
        errmsg:'',
        usname:'',
        passwrd:'',
        items: [
        { title: 'รายรับรายจ่าย', url: {path:'/home', query: {usr:this.$route.query.usr} }, drop: false},
        { title: 'รายการซื้อ', url: {path:'', query: {usr:this.$route.query.usr} }, drop: false},
        { title: 'รายการขาย', url: {path:'', query: {usr:this.$route.query.usr} }, drop: false},
        { title: 'สต๊อกสินค้า', url: {path:'', query: {usr:this.$route.query.usr} }, drop: true, subt:[
          {subtitle: 'สินค้าดิบ'},
          {subtitle: 'สินค้าแปรรูป'}
        ]},
        { title: 'สรุปยอด', url: {path:'/report', query: {usr:this.$route.query.usr} }, drop: false},
        { title: 'ออกจากระบบ', url: {path:'/'}}
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
                this.userLogin = usname
                this.$router.push({path:'/home', query: {usr:usname} })
            }else{
                this.errmsg = "* wrong username or password"
            }
    },
    link: function(url) {
      // this.$router.push({path:url.path, query: {usr:url.query }})
      if(url.path != '/'){
        this.$router.push(url)
      }else{
        this.$router.push(url)
        this.isLogin=false
        this.usname='',
        this.passwrd=''
      }
    }
  },
  created () {
    if(this.$route.query.usr!=null){
      this.userLogin = this.$route.query.usr
      this.isLogin = true
    }
  }
}
</script>
