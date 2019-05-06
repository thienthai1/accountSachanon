<template>
    <v-container>
    <h1>Welcome {{ this.$route.query.usr }}</h1>
    <p>{{ showId }}</p>
    </v-container>
</template>

<script>
  import firebase from '../firebase'
  import myId from '../main'
  myId = this.$route.query.usr
  export default {
  name: 'App',
  props: ['msg'],
  created () {
    // console.log(this.$route.query.id);
    if(this.$route.query.usr == null){
        this.$router.push("/")
    }
  },
  data () {
    return {
        showId: myId
    }
  },
}
</script>