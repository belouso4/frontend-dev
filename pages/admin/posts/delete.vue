<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Удаленные посты</h1>
          </div>
          <div class="col-sm-6">
            <AdminUiBreadcrumbs :name="['Посты', 'Удаленные посты']" />
          </div>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Таблица с постами</h3>
          <div class="card-tools d-flex align-items-center">
            <nuxt-link class="btn btn-outline-dark btn-sm mr-2 text-nowrap"
                       to="/admin/posts/add"><i class="fa-solid fa-user-plus"></i> Добавить</nuxt-link>
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
                <nuxt-link title="Посмотреть" class="btn btn-outline-dark btn-sm" :to="'/posts/'+post.slug">
                  <i class="fa-solid fa-eye"></i>
                </nuxt-link>
                <nuxt-link title="Редактировать" class="btn btn-outline-dark btn-sm" :to="'/admin/posts/'+post.slug">
                  <i class="fas fa-pencil-alt">
                  </i>
                </nuxt-link>
                <a title="Восстановить"  @click.prevent="restorePost(post.id)" class="btn btn-outline-dark btn-sm" href="#">
                  <i class="fa-solid fa-trash-arrow-up"></i>
                </a>
                <a title="Удалить" @click.prevent="delPost(post.id)" class="btn btn-outline-dark btn-sm" href="#">
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

        <div class="card-footer d-flex align-content-center justify-content-between">
          <div>
            <button v-if="checkbox.length" title="Восстановить"  @click="restoreAllPost()" class="btn btn-outline-dark">
              <i class="fa-solid fa-trash-arrow-up"></i>
            </button>
            <button title="Удалить" v-if="checkbox.length" @click="deleteAllPost()"  class="btn btn-outline-dark">
              <i class="fas fa-trash"></i>
            </button>
            <button @click="showCheckbox = !showCheckbox" class="btn btn-default">Выбрать</button>
          </div>
          <pagination :show-disabled="true" :limit="1" :data="posts" @pagination-change-page="getResults"></pagination>
        </div>

      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "delete",
  layout: 'Admin',
  middleware: 'permission',
  meta: {
    permission: "post.delete"
  },
  data() {
    return {
      BASE_URL: process.env.API_BASE_URL,
      showCheckbox: false,
      checkbox: [],
      loading: false
    }
  },

  async asyncData({$api}) {
    try {
      const posts = await $api.adminPosts.getDeletedPosts(1)
      return {posts}
    } catch (err) {console.log(err)}
  },

  methods: {
    async getResults(page = 1) {
      try {
        this.loading = true

        this.posts = await this.$api.adminPosts.getDeletedPosts(page)
        this.loading = false
      } catch (err) {console.log(err)}
    },

    async delPost(id) {
      try {
        this.loading = true

        await this.$api.adminPosts.deleteDeletedPosts(id)
        await this.getResults()

        this.showCheckbox = false
        this.checkbox = []
      } catch (err) {console.log(err)}

      this.loading = false
    },

    deleteAllPost() {
      if (this.checkbox.length <= 0) return false
      this.delPost(this.checkbox.join(','))
    },

    async restorePost(id) {
      try {
        this.loading = true

        await this.$api.adminPosts.restore(id)
        await this.getResults()

        this.showCheckbox = false
        this.checkbox = []
      } catch (err) {console.log(err)}

      this.loading = false
    },

    restoreAllPost() {
      if (this.checkbox.length <= 0) return false
      this.restorePost(this.checkbox.join(','))
    },

    status(status, del = null) {
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

</style>
