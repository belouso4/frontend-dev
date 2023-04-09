<template>
  <button @click="fetch" :disabled="loading" type="submit" class="btn btn-block btn-secondary btn-with-loader ml-auto">
    <span v-if="!loading">
      <slot/>
    </span>
    <Loader width="20px" v-else/>
  </button>
</template>

<script>
export default {
  name: "ButtonLoader",
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    fetch: {
      type: Function,
      default: () => {}
    }
  },
}
</script>

<style scoped>

</style>
