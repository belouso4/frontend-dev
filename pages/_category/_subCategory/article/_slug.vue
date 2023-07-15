<template>
  <div class="wrapper-post single-page">
    <h1>{{ post.title }}</h1>
    <img :src="post.img" class="img-preview">
    <div class="news-item-area_desc" v-html="post.desc"></div>
    <Comments :comments="comments"/>
  </div>
</template>

<script>
import {mapMutations} from "vuex";
import Comments from "../../../../components/Comments";
import SocialMetadata from "~/mixins/social-metadata.js";

export default {
  name: 'addPost',
  components: {Comments},
  layout: 'AppMain',
  mixins: [SocialMetadata],

  async validate({ params, route, query, store }) {
    let validCategory = await store.dispatch('core/validCategory', {
      path: route.path,
      slug: params.slug
    })

    return !!params.slug && !!validCategory
  },

  async asyncData({$api, params, store}) {
    try {
      const [post, comments] = await Promise.all([
        $api.posts.show(params.slug),
        $api.comments.index(params.slug, 0)
      ]);

      store.commit('core/setTitle',post.title)

      return {post, comments}
    } catch (err) {console.log(err)}
  },

  computed: {
    meta() {
      return {
        title: this.post.metadata.title || this.post.title,
        description: this.post.metadata.description || this.post.excerpt || '',
        image: this.post.img,
        keywords: this.post.metadata.keywords,
        createdAt: this.post.created_at,
        updatedAt: this.post.updated_at,
        tags: this.post.tags.map(obj => obj.tag),
        url: process.env.BASE_URL+this.post.url,
      }
    }
  },

  methods: {
    ...mapMutations('breadcrumbs', {
      setBreadcrumbs: 'set',
      pushBreadcrumb: 'push',
      popBreadcrumb: 'pop',
      replaceBreadcrumb: 'replace',
      emptyBreadcrumbs: 'empty'
    }),

    categoryPath() {
      let path = this.$route.path.split('/').filter(e => e !== '')
      path.splice(-2)

      return path.join('/')
    }
  },

  async created() {
    this.setBreadcrumbs([
      { text: 'Главная', to: { path: '/' }},
      { text: this.post.category_name, to: { path: '/'+this.categoryPath() }},
      { text: ':user' } // placeholder
    ]);

    this.replaceBreadcrumb({
      find: ':user',
      replace: { text: this.post.title }
    });
  }

}
</script>

<style>

</style>
