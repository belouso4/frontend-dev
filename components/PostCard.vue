<template>
  <div class="news-item">
    <img :src="post.img" alt="">
    <div class="news-item-area">
      <nuxt-link :to="'/post/'+post.slug">
        <h3 class="news-item-area_title">
          {{ post.title }}
        </h3>
      </nuxt-link>
      <p class="news-item-area_desc">
        {{post.excerpt != null ? post.excerpt : post.desc}}
      </p>
      <div class="tags">
        <a v-if="post.tags.length" v-for="tag in post.tags">{{ tag.tag }}</a>
      </div>
      <div class="news-item-area_elem">
        <p>{{ post.post_view_count }} <i class="far fa-eye"></i></p>
        <a href=""><i class="fas fa-share"></i></a>
        <a href="" @click.prevent="like(post.slug, post.user_like_count)" :class="[{ active: post.user_like_count }, 'like']">
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
      BASE_URL: process.env.API_BASE_URL_IMG,
    }
  },
  methods:{

    like(slug, user_like_count) {
      this.$api.posts.like(slug)

      if (user_like_count == 0) {
        this.post.user_like_count++
        this.post.likes_count++
      } else {
        this.post.user_like_count--
        this.post.likes_count--
      }

    },
  },
}
</script>

<style scoped>

</style>
