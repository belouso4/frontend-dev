<template>
  <ul class="breadcrumbs">
    <li v-for="crumb in $store.state.breadcrumbs.breadcrumbs"
        :class="['breadcrumb-item', {'active': !(!!crumb.to)}]">
      <nuxt-link v-if="!!crumb.to" :to="crumb.to.path">{{ crumb.text }}</nuxt-link>
      <span v-else>{{ crumb.text }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: "Breadcrumbs",
}
</script>

<style scoped>
</style>
