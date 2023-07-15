<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Список всех постов</h1>
          </div>
          <div class="col-sm-6">
            <AdminUiBreadcrumbs :name="['Посты']" />
          </div>
        </div>
      </div><!-- /.container-fluid -->
    </section>

    <section class="content">
      <div class="container-fluid">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Таблица с постами</h3>
            <div class="card-tools d-flex align-items-center">
              <nuxt-link class="btn btn-outline-dark btn-sm mr-2 text-nowrap"
                         to="/admin/posts/add"><i class="fa-solid fa-plus"></i> Добавить</nuxt-link>
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

          <div class="card-body table-responsive p-0">
            <table  class="table table-head-fixed text-nowrap projects">
              <thead>
              <tr>
                <th style="width: 1%">
                  #
                </th>
                <th style="width: 20%">
                  Название
                </th>
                <th style="width: 30%">
                  Изображение
                </th>
                <th style="width: 8%">
                  Status
                </th>
                <th style="width: 20%">
                  Действия
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="post in posts.data">
                <td v-if="!showCheckbox">
                  {{ post.id }}
                </td>
                <td v-else><input v-model="checkbox" :value="post.id" type="checkbox"></td>
                <td>
                  <span class="table-title">
                    {{ post.title }}
                  </span>
                  <br/>
                  <small>
                    Создано {{ post.created_at }}
                  </small>
                </td>
                <td>
                  <img :src="post.img" alt="">
                </td>
                <td class="project-state">
                  <span :class="['badge badge-'+status(post.status).class]">
                    {{ status(post.status).name }}
                  </span>
                </td>
                <td class="project-actions">
                  <nuxt-link v-can="'post.edit'" title="Редактировать" class="btn btn-outline-dark btn-sm" :to="'/admin/posts/'+post.slug">
                    <i class="fas fa-pencil-alt">
                    </i>
                  </nuxt-link>
                  <nuxt-link title="Посмотреть" target="_blank" class="btn btn-outline-dark btn-sm" :to="post.url">
                    <i class="fa-solid fa-eye"></i>
                  </nuxt-link>
                  <a v-can="'post.delete'" title="Удалить" @click.prevent="delPost(post.id)" class="btn btn-outline-dark btn-sm" href="#">
                    <i class="fas fa-trash">
                    </i>
                  </a>
                </td>
              </tr>
              </tbody>
              <div v-if="loading" class="spinner-load">
                <img src="/loader.gif">
              </div>
            </table>
          </div>
          <!-- /.card-body -->
          <div class="card-footer note-float d-flex align-items-center justify-content-between flex-wrap">
            <div v-can="'post.delete'">
              <button v-if="checkbox.length" @click="deleteAllPost()"  class="btn btn-outline-dark">
                <i class="fas fa-trash"></i>
              </button>
              <button @click="showCheckbox = !showCheckbox" class="btn btn-default">Выбрать</button>
            </div>
            <pagination :show-disabled="true" :limit="1" :data="posts" @pagination-change-page="getResults"></pagination>
            <div v-can="'post.delete'">
              <nuxt-link to="/admin/posts/delete">
                Удаленные посты <i class="fas fa-trash ml-1"></i>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>

      <!-- /.card -->
    </section>

  </div>
</template>

<script>

export default {
  name: "posts",
  layout: 'Admin',
  middleware: 'permission',
  meta: {
    permission: "post.view"
  },

  head() {
    return {
      title: 'Список всех постов',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Список всех постов',
        },
      ],
    }
  },

  async asyncData({app}) {
    try {
      const posts = await app.$api.adminPosts.index(1)
      return {posts}
    } catch (err) {console.log(err)}
  },

  data() {
    return {
      BASE_URL: process.env.API_BASE_URL,
      showCheckbox: false,
      checkbox: [],
      loading: false,
      search: '',
      debounce: false
    }
  },

  methods: {
    async getResults(page) {
      this.loading = true
      if (typeof page === 'undefined') {
        page = 1;
      }

      this.posts = this.search === ''
        ? await this.$api.adminPosts.index(page)
        : await this.$api.adminPosts.search({page, search: this.search})

      this.loading = false
    },

    async delPost(id) {
      this.loading = true

      await this.$api.adminPosts.delete(id)
      await this.getResults()

      this.showCheckbox = false
      this.checkbox = []
    },

    deleteAllPost() {
      if (this.checkbox.length <= 0) return false
      this.delPost(this.checkbox.join(','))
    },

    async searchPosts() {
      if(this.search && this.search.length >= 2) {
        if (this.search.length >= 2) {
          clearTimeout(this.debounce);
          this.loading = true

          this.debounce = setTimeout( () => {
            this.$api.adminPosts.search({search: this.search}).then(response => {
              this.posts = response
            }).catch(() => {
              console.warn('Oh. Something went wrong')
            }).finally(() => {
              this.loading = false
            });
          }, 600);
        }
      } else {
        if (this.search === "") this.getResults(1)
      }
    },

    status(status) {
      if (status === '1')
        return {
          class: 'success',
          name: 'Опубликован'
        }
      else if (status === '0')
        return {
          class: 'warning',
          name: 'Ограничен'
        }
      else
        return {
          class: 'warning',
          name: 'null'
        }
    },
  },
}
</script>

<style>
td img {
  height: 96px;
  object-fit: contain;
  width: 156px;
  margin: 0 auto;
}

tr {
  text-align: center;
}

.table td, .table th {
  padding: 1rem;
}

.table-title {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* number of lines to show */
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

/*320px-576px*/
@media screen and (max-width: 576px) {

.pagination {
  order: -1;
  width: 100%;
  margin-bottom: 20px!important;
  /* margin: 0 auto; */
  display: flex;
  justify-content: center;
}

  .card-header .card-title {
    margin-bottom: 15px;
  }
}
</style>
