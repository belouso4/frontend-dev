<template>
  <div class="news-item">
    <img :src="post.img" alt="">
    <div class="news-item-area">
      <nuxt-link :to="path + 'article/' + post.slug">
        <h3 class="news-item-area_title">
          {{ post.title }}
        </h3>
      </nuxt-link>
      <p class="news-item-area_desc">
        {{post.excerpt}}
      </p>
      <div class="tags">
        <a v-if="post.tags.length" v-for="tag in post.tags">{{ tag.tag }}</a>
      </div>
      <div class="news-item-area_elem">
        <p>{{ post.post_view_count }} <i class="far fa-eye"></i></p>
        <a href=""><i class="fas fa-share"></i></a>
        <a href="" @click.prevent="like(post.id)" :class="[{ active: post.like_my }, 'like']">
          <i class="far fa-heart"></i>
          <span class="like-count">
            {{ post.likes_count }}
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "PostCard",
  props: ['post'],
  data() {
    return {
      path: this.$route.path.endsWith('/') ? this.$route.path : this.$route.path + '/'
    }
  },

  methods:{
    async like(id) {
      try {
        const like = await this.$api.posts.like(id)

        this.post.likes_count = like.like_count
        this.post.like_my = like.like_my
      } catch (err){ console.log(err)}
    },
  },


}
</script>

<style scoped>

</style>
