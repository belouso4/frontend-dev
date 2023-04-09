<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Пользователи с ролями</h1>
          </div>
          <div class="col-sm-6">
            <AdminUiBreadcrumbs :name="['Пользователи', 'Пользователи с ролями']" />
          </div>
        </div>
      </div><!-- /.container-fluid -->
    </section>
    <section class="content">
      <div class="container-fluid">
        <div class="card">
          <div class="card-header d-flex">
            <div class="card-tools d-flex align-items-center ml-auto">
              <nuxt-link class="btn btn-outline-dark btn-sm mr-2 text-nowrap"
                         to="/admin/users/add"><i class="fa-solid fa-user-plus"></i> Добавить</nuxt-link>
              <form @submit.prevent="searchUsers()" class="form-search input-group input-group-sm">
                <input v-model="search"
                       @keyup="searchUsers()"
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

          <div class="card-body pb-0">
            <div class="row">
              <div v-for="user in users.data" class="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column">
                <div class="card bg-light d-flex flex-fill">
                  <div class="card-header text-muted border-bottom-0">
                    {{user.role.name}}
                  </div>
                  <div class="card-body pt-0">
                    <div class="row">
                      <div class="col-7">
                        <h2 class="lead"><b>{{ user.name }}</b></h2>
                        <p class="text-muted text-sm"><b>Описание роли: </b> {{ user.role ? user.role.desc : '-' }} </p>
                        <ul class="ml-4 mb-0 fa-ul text-muted">
                          <li class="small">
                            <span class="fa-li">
                              <i class="fas fa-lg fa-building"></i>
                            </span>
                            Email: {{user.email}}
                          </li>
                          <li class="small">
                            <span class="fa-li">
                              <i class="fas fa-lg fa-phone"></i>
                            </span>
                            Телефон #: -
                          </li>
                        </ul>
                      </div>
                      <div class="col-5 text-center">
                        <img :src="user.avatar" alt="user-avatar" class="img-circle img-fluid">
                      </div>
                    </div>
                  </div>
                  <div class="card-footer">
                    <div class="text-right">
                      <a class="btn btn-sm bg-danger" title="Удалить" @click="remove(user.id)">
                        <i class="fas fa-trash"></i>
                      </a>
                      <nuxt-link :to="'/admin/users/' + user.id" title="Редактировать" class="btn btn-sm btn-primary">
                        <i class="fas fa-user"></i> Редактировать
                      </nuxt-link>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="loading" class="spinner-load">
                <img src="/loader.gif">
              </div>
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
  name: "roles",
  layout: 'Admin',
  middleware: 'permission',
  meta: {
    permission: 'role.view'
  },
  async asyncData({$api, params}) {
    try {
      const users = await $api.adminUsersRoles.index(1)

      return {users}
    } catch (err) {console.log(err)}
  },

  data() {
    return {
      debounce: null,
      loading: false,
      search: ''
    }
  },

  methods: {
    async getResults(page = 1) {
      this.loading = true

      try {
        this.users = await this.$api.adminUsersRoles.index(page)
      } catch (err) {console.log(err)}

      this.loading = false
    },

    async remove(id) {
      try {
        this.loading = true

        await this.$api.adminUsers.delete(id)
        await this.getResults()

        this.loading = false
      } catch (err) {console.log(err)}
    },

    searchUsers() {
      if(this.search && this.search.length >= 2) {
        this.loading = true
        clearTimeout(this.debounce);

        this.debounce = setTimeout(async () => {
          try {
            this.users = await this.$api.adminUsersRoles.search(this.search)
          } catch (err){console.log(err)}

          this.loading = false
        }, 600);

      } else {
        if (this.search === '') this.getResults(1)
      }
    },
  },
}
</script>

<style>

.filter-elem {
  position: relative;
  z-index: 10;
}

.filter-elem > .tags-input-with-loader {
  position: absolute;
  width: 300px;
}

.filter-elem > .tags-input-with-loader > img {
  position: absolute;
  width: 21px;
  bottom: 9px;
  right: 7px;
}
</style>
