<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Список постов</h3>
      <div class="card-tools d-flex align-items-center">
        <form @submit.prevent="searchPosts()" class="form-search input-group input-group-sm">
          <input v-model="search"
                 @keyup="searchPosts()"
                 type="text"
                 name="table_search"
                 class="form-control float-right border-dark"
                 placeholder="Поиск...">
          <div class="input-group-append">
            <button type="submit" class="btn btn-default border-dark">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="card-body p-0">
      <ol class="collection collection-container">
        <!-- The first list item is the header of the table -->
        <li class="item item-container header">
          <div class="attribute">Изображение</div>
          <div class="attribute" data-name="#">Название</div>
          <div class="attribute" data-name="#">Действие</div>
        </li>

        <li v-for="post in posts.data"  class="item item-container">
          <div class="attribute"><img width="100" :src="post.img" alt=""></div>
          <div class="attribute">{{ post.title }}</div>
          <div class="attribute">
            <button @click="addSlide(post)" class="arrow-hover" type="button" title="Добавить">
              <i data-v-92945e56="" class="fas fa-chevron-right"></i>
            </button>
          </div>
        </li>

      </ol>
      <div v-if="loadingPost" class="spinner-load">
        <img src="/loader.gif">
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "PostsSection",

  data() {
    return {
      search: '',
      debounce: false,
      loadingPost: false,
    }
  },

  computed: {
    ...mapGetters({
      posts: 'slider/getPosts',
      slider: 'slider/getSlider',
      limit: 'slider/getLimit',
    }),
  },

  methods: {
    async getResults(page = 1) {
      this.loadingPost = true

      try {

        let posts = this.search === ''
          ? await this.$api.adminPosts.index(page, 5)
          : await this.$api.adminPosts.search({page, search: this.search})

        this.$store.commit('slider/setPosts', posts)

      } catch (err) {console.log(err)}

      this.loadingPost = false
    },

    async searchPosts() {
      if(this.search && this.search.length >= 2) {
        if (this.search.length >= 2) {
          clearTimeout(this.debounce);
          this.loadingPost = true

          this.debounce = setTimeout( () => {
            const query = {search: this.search, take: 5}

            this.$api.adminPosts.search(query).then(response => {
              this.$store.commit('slider/setPosts', response)
            })
            .catch(() => console.warn('Oh. Something went wrong'))
            .finally(() => this.loadingPost = false);

          }, 600);

        }
      } else {
        if (this.search === "") this.getResults(1)
      }
    },

    async addSlide(post) {
      if (!this.slider.some(e => e.id === post.id) && !this.loading) {
        this.$store.commit('slider/setLoading', true)

        try {
          let ids = this.slider.map(a => a.id);

          await this.$api.adminOther.add({id: post.id})
          await this.$store.dispatch('slider/fetchSlider')
        } catch (err) {console.log(err)}

        this.$store.commit('slider/setLoading', false)
      }
    },
  },
}
</script>

<style scoped>

.arrow-hover{
  background: #fff;
  width: 31px;
  height: 31px;
  border-radius: 50%;
  text-align: center;
  transition: all .3s ease;
  cursor: pointer;
  user-select: none;

  color: #a8a8a8;
  border: 1px solid #a8a8a8;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-hover i{
  display: block;
}

.arrow-hover:hover{
  opacity: 0.5;
}

</style>
