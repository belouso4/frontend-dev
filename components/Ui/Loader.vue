<template>
  <img :src="mySVG" alt="">
</template>

<script>
export default {
  name: "Loader",
  data() {
    return {
      mySVG: require('/static/loader.gif')
    }
  }
}
</script>

<style scoped>



</style>
