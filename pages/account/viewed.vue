<template>
  <div class="right-content account-wrapper">
    <div v-for="post in posts" class="account-wrapper-post-elem">
      <img :src="post.img" alt="">
      <div>
        <nuxt-link :to="post.url"><h4>{{ post.title }}</h4></nuxt-link>
        <p>{{ post.excerpt }}</p>
      </div>
      <div class="post-elem_action grey">
        <a>
          <i class="fas fa-eye"></i>
        </a>
      </div>
    </div>
    <infinite-loading v-if="posts.length && posts.length >= 10" spinner="spiral" @infinite="infiniteScroll"></infinite-loading>
  </div>
</template>

<script>
import {mapMutations} from "vuex";

export default {
  name: "viewed",
  async asyncData({$api}) {
    try {
      const posts = await $api.account.viewed()
      return {posts, page: 0}
    } catch (err) {console.log(err)}
  },

  methods: {
    ...mapMutations('breadcrumbs', {
      setBreadcrumbs: 'set',
    }),

    infiniteScroll($state) {
      setTimeout(async () => {
        try {
          this.page++;

          const posts = await this.$api.account.viewed(this.page)
          if(posts.length) this.posts.push(...posts)

          if(posts.length && posts.length >= 10) {
            $state.loaded();
          } else {
            $state.complete()
          }

        } catch (err) {console.log(err)}
      }, 500);
    },
  },

  mounted() {
    this.setBreadcrumbs([
      { text: 'Главная', to: { path: '/' }},
      { text: 'История просмотров'},
    ]);
  },

}
</script>

<style>
.post-elem_action.grey a {
  cursor: default;
}

.post-elem_action.grey i {
  color: #cecece;
}
</style>
