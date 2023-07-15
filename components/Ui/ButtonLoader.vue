<template>
  <button @click="fetch" :disabled="loading" type="submit" class="btn-with-loader">
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
.btn-with-loader {
  position: relative;
}

.btn-with-loader[disabled="disabled"] {
  box-shadow: inset -3px -3px 7px #ffffff, inset 3px 3px 5px #ceced1;
  cursor: default;
}

.btn-with-loader img {
  -o-object-fit: contain;
  object-fit: contain;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.opacity {
  opacity: 0;
}
</style>
