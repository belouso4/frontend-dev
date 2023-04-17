<template>
  <ul>
    <li v-for="category in categories" :key="category.id">
      <a class="cursor-pointer" v-if="category.children.length">{{ category.name }}</a>
      <nuxt-link v-else :to="'/' + category.slug">{{ category.name }}</nuxt-link>
      <ul class="references-menu" v-if="category.children.length">
        <children-categories v-for="children in category.children" :key="children.id" :url="'/' + category.slug" :categories="children"/>
      </ul>
    </li>
  </ul>
</template>

<script>
import {mapGetters} from "vuex";
import ChildrenCategories from "./ChildrenCategories";

export default {
  name: "NestedMenu",
  components: {ChildrenCategories},
  computed: {
    ...mapGetters({
      categories: 'core/getCategories'
    }),
  },

}
</script>

<style scoped>

</style>
