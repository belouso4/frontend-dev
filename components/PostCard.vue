<template>
  <div class="news-item">
    <img :data-src="post.img" class="lazyload" />
    <div class="news-item-area">
      <nuxt-link :to="post.url">
        <h3 class="news-item-area_title">
          {{ post.title }}
        </h3>
      </nuxt-link>
      <p class="news-item-area_desc">
        {{post.excerpt}}
      </p>
      <div class="tags" v-if="post.tags.length">
        <nuxt-link v-for="tag in post.tags" :key="'tag-'+tag.slug" :to="'/tag/'+tag.slug">{{ tag.tag }}</nuxt-link>
      </div>
      <div class="news-item-area_elem">
        <p>{{ post.post_view_count }} <i class="far fa-eye"></i></p>
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
  // data() {
  //   return {
  //     path: this.$route.path.endsWith('/') ? this.$route.path : this.$route.path + '/'
  //   }
  // },

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

<style>

.tags::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.tags {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
