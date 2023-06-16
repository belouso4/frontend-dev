<template>
  <div class="right-content account-wrapper">
    <div v-for="post in posts" class="account-wrapper-post-elem">
      <img :src="post.img" alt="">
      <div>
        <nuxt-link :to="post.url"><h4>{{ post.title }}</h4></nuxt-link>
        <p>{{ post.excerpt }}</p>
      </div>
      <div class="post-elem_action like_action">
        <a @click.prevent="like(post.id)" :class="[{ active: post.like_my }, 'like']">
          <i class="far fa-heart"></i>
          <span class="like-count">
            {{ post.likes_count }}
          </span>
        </a>
      </div>
    </div>
    <client-only>
    <infinite-loading v-if="posts.length && posts.length >= 10" spinner="spiral" @infinite="infiniteScroll"></infinite-loading>
    </client-only>
  </div>
</template>

<script>
import {mapMutations} from "vuex";

export default {
  name: "liked",
  async asyncData({$api}) {
    try {
      const posts = await $api.account.liked()
      return {posts, page: 0}
    } catch (err) {console.log(err)}
  },

  methods:{
    async like(id) {
      try {
        const like = await this.$api.posts.like(id)

        this.posts.map((item) => {
          if (+item.id === +id) {
            console.log(item)
            item.likes_count = like.like_count
            item.like_my = like.like_my
          }
        })
      } catch (err){ console.log(err)}
    },

    infiniteScroll($state) {
      setTimeout(async () => {
        try {
          this.page++; // next page

          const posts = await this.$api.account.liked(this.page)
          if(posts.length) this.posts.push(...posts)

          if(posts.length && posts.length >= 10) {
            $state.loaded();
          } else {
            $state.complete()
          }
        } catch (err) {console.log(err)}

      }, 500);
    },

    ...mapMutations('breadcrumbs', {
      setBreadcrumbs: 'set',
    }),
  },

  mounted() {
    this.setBreadcrumbs([
      { text: 'Главная', to: { path: '/' }},
      { text: 'Понравившиеся посты'},
    ]);
  },
}
</script>

<style>
.like.active {
  color: var(--text-red);
}

.account-wrapper-post-elem .post-elem_action {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}

.account-wrapper-post-elem .post-elem_action a {
  text-decoration: none;
  cursor: pointer;
}

.account-wrapper-post-elem .post-elem_action.like_action a:hover {
  color: var(--base-text-color);
}

.account-wrapper-post-elem {
  height: 92px;
  display: grid;
  grid-template-columns: auto 6fr 2fr;
  grid-column-gap: 20px;
  /*border: 1px solid #cecece;*/
}

.account-wrapper-post-elem img{
  /*object-fit: contain;*/
  height: inherit;
}

.account-wrapper-post-elem > img + div {
  padding: 10px 0;
}

.account-wrapper-post-elem > img + div h4 {
  margin-bottom: 5px;
}

.account-wrapper-post-elem > img + div p {
  line-height: 20px;
  font-size: 14px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.right-content.account-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

</style>
