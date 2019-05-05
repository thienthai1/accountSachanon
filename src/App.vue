<template>
  <v-app>
    <router-view></router-view>
    <h1>{{ ng }}</h1>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import firebase from './firebase'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data () {
    return {
      ng: test()
    }
  },
  created() {
    var readRef = firebase.database().ref('members/thienthai/password');
    readRef.on('value', function(snapshot) {
      alert(snapshot.val())
    });
  }
}
</script>
