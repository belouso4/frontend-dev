<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Другое</h1>
          </div>
          <div class="col-sm-6">
            <AdminUiBreadcrumbs :name="['Другое']" />
          </div>
        </div>
      </div><!-- /.container-fluid -->
    </section>

    <section class="content">
      <div class="container-fluid">
        <div class="card">
          <div class="card-header border-bottom-0">
            <h3>Главный слайдер</h3>
          </div>

          <div class="card-body p-0">
            <div class="row">
              <div class="col-md-6">
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

                      <li v-for="post in posts.data" @click="addSlide(post)" class="item item-container cursor-pointer">
                        <div class="attribute"><img width="100" :src="post.img" alt=""></div>
                        <div class="attribute">{{ post.title }}</div>
                        <div class="attribute">
                          <button type="button" title="Удалить" class="btn btn-sm">
                            #
                          </button>
                        </div>
                      </li>

                    </ol>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header note-float d-flex align-items-center justify-content-between">
                    <h3 class="card-title">Список постов в слайдере</h3>
                    <Loader v-if="loading" width="15"/>
                  </div>
                  <div class="card-body p-0">
                    <client-only>
                      <list-slider
                        :updateSlider="updateSlider"
                        :checkChanges="checkChanges"
                        :removeSlide="removeSlide"
                        :slider.sync="slider"/>
                    </client-only>

<!--                    <table  class="table projects">-->
<!--                      <thead>-->
<!--                      <tr>-->
<!--                        <th style="width: 10%">-->
<!--                          Изображение-->
<!--                        </th>-->
<!--                        <th style="width: 85%">-->
<!--                          Название-->
<!--                        </th>-->
<!--                        <th style="width: 5%">-->
<!--                          Действия-->
<!--                        </th>-->
<!--                      </tr>-->
<!--                      </thead>-->
<!--                      <tbody>-->
<!--                      <vue-nestable :maxDepth="2" v-model="slider">-->
<!--                        <vue-nestable-handle-->
<!--                          slot-scope="{ item }"-->
<!--                          :item="item">-->
<!--                          <tr>-->
<!--                            <td>-->
<!--                              <img width="100" :src="item.img" alt="">-->
<!--                            </td>-->
<!--                            <td>-->
<!--                              {{ item.title }}-->
<!--                            </td>-->
<!--                            <td class="project-actions">-->

<!--                              <button @click="removeSlide(item.id)" type="button" title="Удалить" class="btn btn-sm">-->
<!--                                <i class="fas fa-trash"></i>-->
<!--                              </button>-->

<!--                            </td>-->
<!--                          </tr>-->
<!--                        </vue-nestable-handle>-->
<!--                      </vue-nestable>-->

<!--                      </tbody>-->
<!--                    </table>-->
                  </div>
                </div>
              </div>

            </div>
          </div>
          <!-- /.card-body -->
          <div class="card-footer note-float d-flex align-items-center justify-content-between">

          </div>
        </div>

      </div>

      <!-- /.card -->
    </section>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import listSlider from "../../../components/admin/other/ListSlider";

export default {
  name: "index",
  layout: 'Admin',
  components: {listSlider},
  async asyncData({$api}) {
    try {
      const posts = await $api.adminPosts.index(1, 5)
      const slider = await $api.adminOther.index(1)

      return {posts, slider, sliderCopy: [...slider]}
    } catch (err) {console.log(err)}
  },

  data() {
    return {
      loading: false,
      search: '',
      debounce: false,
      loadingPost: false
    }
  },

  methods: {
    async getResults(page) {
      this.loadingPost = true
      if (typeof page === 'undefined') {
        page = 1;
      }

      this.posts = this.search === ''
        ? await this.$api.adminPosts.index(page, 5)
        : await this.$api.adminPosts.search({page, search: this.search})

      this.loadingPost = false
    },

    async searchPosts() {
      if(this.search && this.search.length >= 2) {
        if (this.search.length >= 2) {
          clearTimeout(this.debounce);
          this.loadingPost = true

          this.debounce = setTimeout( () => {
            this.$api.adminPosts.search({search: this.search, take: 5}).then(response => {
              console.log(response)
              this.posts = response
            }).catch(() => {
              console.warn('Oh. Something went wrong')
            }).finally(() => {
              this.loadingPost = false
            });
          }, 600);
        }
      } else {
        if (this.search === "") this.getResults(1)
      }
    },

    async updateSlider() {
      this.loading = true
      try {
        let ids = this.slider.map(a => a.id);
        const slider = await this.$api.adminOther.update({data: this.slider})

        this.slider = slider
        this.sliderCopy = slider
      } catch (err) {console.log(err)}

      this.loading = false
    },

    // async updateSlider() {
    //   this.loading = true
    //   try {
    //     let ids = this.slider.map(a => a.id);
    //     const slider = await this.$api.adminOther.update(ids)
    //
    //     this.slider = slider
    //     this.sliderCopy = slider
    //   } catch (err) {console.log(err)}
    //
    //   this.loading = false
    // },

    addSlide(post) {
      if (!this.slider.some(e => e.id === post.id)) {
        post.order = 0
        this.slider.push(post)
        this.updateSlider()
      }
    },

    removeSlide(id) {
      this.slider.splice(this.slider.findIndex(v => v.id === id), 1)
      this.updateSlider()
    },

    checkChanges() {
      let slider = JSON.parse ( JSON.stringify ( this.slider) )
      let sliderCopy = JSON.parse ( JSON.stringify ( this.sliderCopy))

      return this.compareObjects(
        slider,
        sliderCopy
      )
    },

    compareObjects(x, y) {
      var objectsAreSame = true;

      for (let i = 0; x.length > i; i++) {
        for(var propertyName in x[i]) {
          if (propertyName === 'children') continue

          if(x[i][propertyName] !== y[i][propertyName]) {
            objectsAreSame = false;
            break;
          }
        }
      }

      return objectsAreSame;
    },
  }
}
</script>

<style>


</style>
