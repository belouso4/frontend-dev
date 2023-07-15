<template>
  <ul>
    <li v-for="category in categories" :key="category.id">
<!--      <nuxt-link class="cursor-pointer" v-if="category.children.length">{{ category.name }}</nuxt-link>-->
      <nuxt-link no-prefetch :to="'/' + category.slug" :class="[{'item-icon': category.children.length}]">
        {{ category.name }}
        <i v-if="category.children.length" class="fas fa-angle-down"></i>
      </nuxt-link>
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

<style>
.navigation ul li i {
  font-size: 12px;
  color: rgba(0,0,0,.54);
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 12px;
}
.navigation ul li a {
  padding: 12px 25px;
}
.navigation ul li a.item-icon {
  padding-right: 30px;
}
.navigation ul a:hover {
  background: #e0e0e0;
  text-decoration: none;
}

.navigation > ul > li:not(:last-child) {
  margin: 0;
}

.navigation > ul ul {
  min-width: 120px;
  box-shadow: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12);
  overflow: hidden;
}

.navigation > ul ul li a {
  padding-right: 16px;
}

</style>
