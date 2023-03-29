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
          <h3 class="card-title">Таблица с ролями</h3>


          <div class="card-tools d-flex align-items-center">
            <button v-can="'role.create'" @click="modals.userAdd.show = true" class="btn btn-outline-dark btn-sm mr-2">
              <i class="fa-solid fa-plus"></i> Добавить
            </button>
            <form class="form-search input-group input-group-sm" style="width: 300px;">
              <input v-model="search"
                     @keyup="searchRoles()"
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
              <th>
                #
              </th>
              <th>
                Название
              </th>
              <th>
                Пользователи
              </th>
              <th>
                Описание
              </th>
              <th>
                Действия
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="role in roles.data">
              <td>
               {{role.id}}
              </td>
              <td>
                {{role.name}}
              </td>
              <td>
                {{role.users_count}}
              </td>
              <td>
                <span>
                  {{ role.desc }}
                </span>
              </td>
              <td class="project-actions">
                <nuxt-link v-can="'post.edit'" title="Редактировать" class="btn btn-outline-dark btn-sm" :to="'/admin/roles/'+role.id">
                  <i class="fas fa-pencil-alt">
                  </i>
                </nuxt-link>
                <button v-can="'role.delete'" @click="confirDeletion(role.id)" :title="role.id === 1 ? '' : 'Удалить'" :class="['btn btn-outline-dark btn-sm', {'disabled': role.id === 1}]">
                  <i class="fas fa-trash">
                  </i>
                </button>
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
          <pagination :data="roles" @pagination-change-page="getResults"></pagination>
        </div>
      </div>
      <!--      <div class="loading">-->
      <!--        <i class="fa-solid fa-gears"></i>-->
      <!--      </div>-->

      <!-- /.card -->
    </section>
    <create-role-modal :show.sync="modals.userAdd.show"></create-role-modal>
    <warning-modal :action="remove"
                   :show.sync="modals.warning.show"
                   :id.sync="modals.warning.id"/>
  </div>
</template>

<script>

import CreateRoleModal from "../../../components/admin/roles/CreateRoleModal";
import WarningModal from "../../../components/admin/ui/WarningModal";
export default {
  name: "posts",
  middleware: 'permission',
  meta: {
    permission: 'role.view'
  },
  components: {CreateRoleModal, WarningModal},
  layout: 'Admin',
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
      loading: false,
      search: '',
      debounce: false,
      modals: {
        userAdd: {
          show: false,
        },
        warning: {
          show: false,
          id: null,
          action: null
        }
      },
    }
  },

  created() {
    console.log(this.roles)
  },

  async asyncData({app}) {
    const roles = await app.$api.adminRoles.index()
    return {roles}
  },

  methods: {
    async getResults(page) {
      this.loading = true
      if (typeof page === 'undefined') {
        page = 1;
      }

      this.roles = this.search === ''
        ? await this.$api.adminRoles.index(page)
        : await this.$api.adminRoles.search({page, search: this.search})

      this.loading = false
    },

    confirDeletion(id) {
      if(id === 1) return
      this.modals.warning.show = true
      this.modals.warning.id = id
    },

    async remove(id) {
      await this.$api.adminRoles.delete(id)
      this.roles = await this.$api.adminRoles.index(1)
      return true
    },

    searchRoles() {
      if(this.search && this.search.length >= 2) {
        this.loading = true
        clearTimeout(this.debounce);

        this.debounce = setTimeout(() => {
          this.$api.adminRoles.search({search: this.search}).then(response => {
            this.roles = response
          }).catch(() => {
            console.warn('Oh. Something went wrong')
          }).finally(() => {
            this.loading = false
          });
        }, 600);
      } else {
        this.getResults(1)
      }
    },
  }

}
</script>
<style scoped>
tr {
  text-align: center;
}

</style>
