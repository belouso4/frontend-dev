<template>
  <div class="right-content account-wrapper posts-comments">
    <template v-if="posts.length">
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
        <div class="comments">
          <div class="comment-item d-flex">
            <img :src="$config.API_URL_IMG + '/' + post.comment.user.avatar" alt="">
            <div class="comment-item_details">
              <nuxt-link :to="post.url+'?comment_id='+post.comment.id+'#comment-'+post.comment.id">
                <p>{{ post.comment.user.name }}</p>
              </nuxt-link>
              <p>{{ post.comment.body }}</p>
            </div>
          </div>
        </div>
      </div>
      <client-only>
        <infinite-loading v-if="posts.length && posts.length >= 10" spinner="spiral" @infinite="infiniteScroll"></infinite-loading>
      </client-only>
    </template>
    <div v-else>Нет записей</div>

  </div>
</template>

<script>
import {mapMutations} from "vuex";

export default {
  name: "commented",
  async asyncData({$api}) {
    try {
      const posts = await $api.account.commented()
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
          this.page++; // next page

          const posts = await this.$api.account.commented(this.page)
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
      { text: 'Прокомментированные посты'},
    ]);

  },
}
</script>

<style scoped>

.right-content.posts-comments {
  gap: 40px;
}

.posts-comments .account-wrapper-post-elem {
  height: auto;
  display: grid;
  grid-template-columns: auto 6fr 2fr;
  grid-template-rows: 92px auto;
  grid-column-gap: 20px;
  grid-row-gap: 10px;
}

.posts-comments .account-wrapper-post-elem img {
  height: 100%;
}

.posts-comments .account-wrapper-post-elem .comments {
  grid-column: 2 / 4;
  grid-row: 2 / 3;
}

.posts-comments .account-wrapper-post-elem .comments img {
  width: 40px;
  margin-right: 10px;
}

.posts-comments .account-wrapper-post-elem .comments .comment-item_details a {
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 3px;
  display: block;
}

.posts-comments .account-wrapper-post-elem .comments .comment-item_details > p {
  font-size: 12px;
}

</style>
