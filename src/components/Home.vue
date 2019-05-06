<template>
    <v-container>
    <h1>Welcome {{ this.$route.query.usr }}</h1>
    <h1>{{ showId }}</h1>
    </v-container>
</template>

<script>
  import firebase from '../firebase'
  export default {
  name: 'App',
  created () {
    // console.log(this.$route.query.id);
    // if(this.$route.query.usr == null){
    //     this.$router.push("/")
    // }
  },
  data () {
    return {
        
    }
  },
}
</script>