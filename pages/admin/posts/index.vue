<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Список всех постов</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><nuxt-link to="/admin"><i class="fa-solid fa-house"></i></nuxt-link></li>
              <li class="breadcrumb-item active">Посты</li>
            </ol>
          </div>
        </div>
      </div><!-- /.container-fluid -->
    </section>

    <section class="content">

      <!-- Default box -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Таблица с постами</h3>
          <div class="card-tools d-flex align-items-center">
            <nuxt-link class="btn btn-outline-dark btn-sm mr-2 text-nowrap"
                       to="/admin/posts/add"><i class="fa-solid fa-user-plus"></i> Добавить</nuxt-link>
            <form class="form-search input-group input-group-sm">
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
          <table  class="table projects">
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
                  <a>
                    {{ post.title }}
                  </a>
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
                  <nuxt-link title="Посмотреть" class="btn btn-outline-dark btn-sm" :to="'/post/'+post.slug">
                    <i class="fa-solid fa-eye"></i>
                  </nuxt-link>
                  <nuxt-link v-can="'post.edit'" title="Редактировать" class="btn btn-outline-dark btn-sm" :to="'/admin/posts/'+post.slug">
                    <i class="fas fa-pencil-alt">
                    </i>
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
        <div class="card-footer note-float d-flex align-items-center justify-content-between">
          <div v-can="'post.delete'">
            <button v-if="checkbox.length" @click="deleteAllPost()"  class="btn btn-outline-dark">
              <i class="fas fa-trash"></i>
            </button>
            <button @click="showCheckbox = !showCheckbox" class="btn btn-default">Выбрать</button>
          </div>
          <pagination :data="posts" @pagination-change-page="getResults"></pagination>
          <div v-can="'post.delete'">
            <nuxt-link to="/admin/posts/delete">
              Удаленные посты <i class="fas fa-trash ml-1"></i>
            </nuxt-link>
          </div>
        </div>
      </div>
      <!--      <div class="loading">-->
      <!--        <i class="fa-solid fa-gears"></i>-->
      <!--      </div>-->

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

  async asyncData({app}) {
    const posts = await app.$api.adminPosts.index(1)
    return {posts}
  },

  created() {
    console.log(this.posts)
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

    searchPosts() {
      if(this.search && this.search.length >= 2) {
        if (this.search.length >= 2) {
          clearTimeout(this.debounce);

          this.debounce = setTimeout(() => {
            this.loading = true
            this.$api.adminPosts.search({search: this.search}).then(response => {
              console.log(response)
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

.skeleton-box {
  background-color: #c3c3c3;
  display: inline-block;
  position: relative;
  overflow: hidden;
}

.skeleton-img {
  width: 133px;
  height: 133px;
}

.skeleton-min-box {
  height: 30px;
  width: 30px;
}
.skeleton-title {
  width: 157px;
  height: 1em;
}
.skeleton-min-title {
  width: 120px;
  height: 1em;
}
.skeleton-status {
  width: 100px;
  height: 1em;
}

.skeleton-box {
  background-image: -webkit-linear-gradient(left, #ececec 0px, #f4f4f4 40px, #ececec 80px);
  background-image: -o-linear-gradient(left, #ececec 0px, #f4f4f4 40px, #ececec 80px);
  background-image: linear-gradient(90deg, #ececec 0px, #f4f4f4 40px, #ececec 80px);
  /*background-size: 250px;*/
  background-size: 294px;
  -webkit-animation: shine-loading-image 2s infinite ease-out;
  animation: shine-loading-image 2s infinite ease-out;
  content: '';
}

@keyframes shine-loading-image {
  0% {
    background-position: -32px;
  }
  40%, 100% {
    background-position: 208px;
  }

}
.card-footer.note-float::after {
  display: none;
}
.add-post {
  margin-left: auto;
  width: fit-content;
  display: block;
}
.spinner-load {
  position: absolute;
  z-index: 10;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #00000033;
}

.spinner-load img{
  width: 36px;
}
/*.card {*/
/*  min-height: 100vh;*/
/*}*/

button {
  white-space: nowrap;
}

form.form-search {
  max-width: 300px;
  width: 100%;
}

form.form-search input::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #343a40;
  opacity: 1; /* Firefox */
}

form.form-search input:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: #343a40;
}

form.form-search input::-ms-input-placeholder { /* Microsoft Edge */
  color: #343a40;
}
</style>
