<template>
  <ol class="breadcrumb float-sm-right">
    <li :class="['breadcrumb-item', {'active': '/admin' === $route.fullPath}]">
      <nuxt-link v-if="'/admin' !== $route.fullPath" to="/admin">
        <i class="fa-solid fa-house"></i>
      </nuxt-link>
      <i v-else class="fa-solid fa-house"></i>
    </li>
    <li v-for="(crumb, index) in crumbs" :class="['breadcrumb-item', {'active': crumb.path === $route.fullPath}]">
      <nuxt-link v-if="crumb.path !== $route.fullPath" :to="crumb.path">
      {{ crumb.name }}
      </nuxt-link>
      <span v-else>{{ crumb.name }}</span>
    </li>
  </ol>
</template>

<script>
export default {
  name: "Breadcrumbs",
  props: {
    name: {
      type: [Array, String],
      default: null,
    },
  },

  computed: {
    crumbs() {
      const fullPath = this.$route.fullPath
      const params = fullPath.startsWith('/')
        ? fullPath.substring(1).split('/')
        : fullPath.split('/')

      const crumbs = []
      let path = ''

      params.forEach((param, index) => {
        path = `${path}/${param}`
        const match = this.$router.match(path)
        let name;

        if (typeof this.name !== 'string') {
          name = this.name
            ? this.name[index - 1]
            : null
        } else {
          name = this.name
        }

        if (match.name !== null && match.path !== '/admin') {
          crumbs.push({
            name: name || match.name,
            path: match.path,
            slug: match.name
          })
        }
      })

      return crumbs
    },
  },
}
</script>

<style scoped>

</style>
