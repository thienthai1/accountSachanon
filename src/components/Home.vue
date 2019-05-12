<template>
    <v-container>
      <h1>monalisa</h1>
    </v-container>
</template>

<script>
  export default {
  name: 'Home',
  data () {
    return {
        showId: this.$route.query.usr
    }
  },
  methods: {
  }
}
</script>