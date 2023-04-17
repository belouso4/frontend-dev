<template>
  <li>
    <nuxt-link :to="nestedUrl">{{ categories.name }}</nuxt-link>
    <ul v-if="categories.children.length" class="references-menu right">
      <children-categories v-for="children in categories.children" :url="nestedUrl" :key="children.id" :categories="children"/>
    </ul>
  </li>
</template>

<script>
export default {
  name: "ChildrenCategories",
  props: [
    'categories',
    'url',
  ],
  data() {
    return {
      nestedUrl: this.url + '/' + this.categories.slug
    }
  },


}
</script>

<style scoped>

</style>
