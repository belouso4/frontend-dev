<template>
  <img class="lazyload" :data-src="src"
       src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="/>
</template>

<script>
export default {
  name: "LazyImage",
  props: {
    src: { type: String, required: true }
  }
}
</script>

<style scoped>

</style>
