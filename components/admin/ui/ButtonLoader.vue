<template>
  <button @click="fetch" :disabled="loading" type="submit" class="btn btn-secondary float-right btn-with-loader">
    <span :class="[{'opacity': loading}]">
      <slot/>
    </span>
    <Loader width="20px" v-if="loading"/>
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
.opacity {
  opacity: 0;
}

</style>
