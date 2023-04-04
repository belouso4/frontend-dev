<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Каталог пользователей</h1>
          </div>
          <div class="col-sm-6">
            <AdminUiBreadcrumbs :name="['Пользователи', 'Роли']" />
          </div>
        </div>
      </div><!-- /.container-fluid -->
    </section>
    <section class="content">
      <div class="container-fluid">
        <div class="card">
          <div class="card-header d-flex">
            <div class="filter-elem">
              <span @click="filterToggle = !filterToggle" style="cursor: pointer">
                <i class="fa-solid fa-filter"></i>
              </span>
              <client-only>
                <div class="tags-input-with-loader">
                  <vue-tags-input
                    v-if="filterToggle"
                    v-model="tag"
                    @focus="initItems"
                    :tags="tags"
                    :add-only-from-autocomplete="true"
                    :autocomplete-always-open="filterToggle"
                    :autocomplete-items="autocompleteItems"
                    class="tags-input"
                    @tags-changed="update">
                  </vue-tags-input>
                  <Loader v-if="loaderTag"/>
                </div>
              </client-only>
            </div>
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
<!--          <div class="card-body">-->
<!--            <div class="flex-wrap">-->
<!--              <div v-for="user in users" class="user-block" >-->
<!--                <img class="img-circle img-bordered-sm" src="/AdminLTE/dist/img/user1-128x128.jpg" alt="user image">-->
<!--                <div class="username">-->
<!--                  <a href="#">{{user.name}}</a>-->
<!--                  <span>-->
<!--                <nuxt-link :to="'/admin/users/' + user.id" title="Посмотреть">-->
<!--                  <i class="fa-solid fa-eye"></i>-->
<!--                </nuxt-link>-->
<!--                <nuxt-link  :to="'/admin/users/' + user.id" title="Редактировать">-->
<!--                  <i class="fas fa-pencil-alt"></i>-->
<!--                </nuxt-link>-->
<!--                <a title="Удалить" href="#">-->
<!--                  <i class="fas fa-trash"></i>-->
<!--                </a>-->
<!--              </span>-->
<!--                </div>-->
<!--                <span class="description"><strong>{{user.roles[0].name}}</strong> | Email: {{user.email}}</span>-->
<!--                &lt;!&ndash;                  <span class="action">&ndash;&gt;-->
<!--                &lt;!&ndash;                    <a href="/post/455445544dggg" title="Посмотреть">&ndash;&gt;-->
<!--                &lt;!&ndash;                      <i class="fa-solid fa-eye"></i>&ndash;&gt;-->
<!--                &lt;!&ndash;                    </a>&ndash;&gt;-->
<!--                &lt;!&ndash;                    <a href="/admin/posts/455445544dggg" title="Редактировать">&ndash;&gt;-->
<!--                &lt;!&ndash;                      <i class="fas fa-pencil-alt"></i>&ndash;&gt;-->
<!--                &lt;!&ndash;                    </a>&ndash;&gt;-->
<!--                &lt;!&ndash;                    <a title="Удалить" href="#">&ndash;&gt;-->
<!--                &lt;!&ndash;                      <i class="fas fa-trash"></i>&ndash;&gt;-->
<!--                &lt;!&ndash;                    </a>&ndash;&gt;-->
<!--                &lt;!&ndash;                  </span>&ndash;&gt;-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->


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
<!--                      <a href="#" class="btn btn-sm bg-teal">-->
<!--                        <i class="fas fa-comments"></i>-->
<!--                      </a>-->
                      <a class="btn btn-sm bg-danger" title="Удалить" href="#">
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
  async asyncData({app, params}) {
    const users = await app.$api.adminUsersRoles.index(1)
    return {users}
  },

  data() {
    return {
      BASE_URL: process.env.API_BASE_URL,
      filterToggle: false,
      tag: '',
      tags: [],
      autocompleteItems: [],
      debounce: null,
      loading: false,
      loaderTag: false,
      search: ''
    }
  },

  watch: {
    'tag': 'initItems',
    async tags() {
      if (this.tags.length) {
        // this.loading = true
        let tags = []
        this.tags.forEach(obj => tags.push(obj.text))
        console.log(tags)
        // this.users = await this.$api.adminUsersRoles.search(tags.join())
      } else {
        this.getResults()
      }
    }
  },

  created() {
    console.log(this.users)
  },

  methods: {
    async getResults(page) {
      this.loading = true
      if (typeof page === 'undefined') {
        page = 1;
      }

      this.users = await this.$api.adminUsersRoles.index(page)
      this.loading = false
    },

    searchUsers() {
      if(this.search && this.search.length >= 2) {
        this.loading = true
        clearTimeout(this.debounce);

        this.debounce = setTimeout(() => {
          this.$api.adminUsersRoles.search({search: this.search}).then(response => {
            console.log(response)
            this.users = response
          }).catch(() => {
            console.warn('Oh. Something went wrong')
          }).finally(() => {
            this.loading = false
          });
        }, 600);

      } else {
        if (this.search === '') this.getResults(1)
      }
    },

    update(newTags) {
      this.autocompleteItems = [];
      this.tags = newTags;
    },

    initItems() {
      // if (this.tag.length < 2) return;
      this.loaderTag = true
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.$api.adminUsersRoles.search({'filter-list': this.tag}).then(response => {
          this.autocompleteItems = response.map(a => {
            return ({text: a.name, id: a.id});
          });
          this.loaderTag = false
        }).catch(() => console.warn('Oh. Something went wrong'));
      }, 600);

    },
  },
}
</script>

<style>
.user-block {
  position: relative;
}
/*.user-block >div {*/
/*  position: absolute;*/
/*  text-align: right;*/
/*  opacity: 0;*/
/*  top: 0;*/
/*  right: 0;*/
/*  bottom: 0;*/
/*  left: 0;*/
/*  transition: opacity .4s ease;*/
/*}*/

/*.user-block:hover > div{*/
/*  opacity: 1;*/
/*  transition: opacity .4s ease;*/
/*}*/


.user-block:hover > .username > span, .user-block:hover .action{
  opacity: 1;
}


.user-block .username > a {
  margin-right: 5px;
}

.user-block .action {
  display: block;
  margin-left: 50px;
}

.user-block .username > span, .user-block .action  {


  opacity: 0;
  transition: opacity .2s ease;
}

.user-block .username > span a, .user-block .action a{
  font-size: 14px;
  color: #343a40;
  opacity: 0.5;
}

.user-block .username > span a:not(:last-child), .user-block .action a:not(:last-child){
  margin-right: 3px;
}

.user-block .username > span a:hover, .user-block .action a:hover{

  opacity: 1;
}

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
