<template>
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
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="login()" color="primary">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
</template>

<script>
  import myId from '../main'
  import firebase from '../firebase'
  export default {
  name: 'App',
  data () {
    return {
      msg: ''
    }
  },
  methods: {
    login: function() {
      var usrname = this.usname;
      var passwrd = this.passwrd;
      var readRef = firebase.database().ref('/members/' + usrname + '/password/');
      var foo = 0;
      readRef.on('value', function(snapshot) {
        foo = snapshot.val()
      });
      if(passwrd == foo){
          this.$router.push({path:'/home', query: {usr:usrname} })
      }else{
          alert("wrong password")
      }
    }
  },
  created () {
    
  }
}
</script>