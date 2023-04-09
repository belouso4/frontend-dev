<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Редактирование роли: {{title}}</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <AdminUiBreadcrumbs :name="['Роли', title]" />
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div>
    </section>
    <section class="content">
      <div class="container-fluid">
        <div class="container-fluid">

          <div class="row">
            <div class="col-md-6 d-flex">
              <div class="card card-primary flex-fill">
                <div class="card-body">

                  <form-group :validator="$v.form.name" label="Название роли">
                    <input v-model.trim="form.name" type="text" class="form-control" id="header-name" placeholder="Введите заголовок">
                  </form-group>

                  <form-group :validator="$v.form.desc" label="Описание">
                    <textarea @input="textAreaAdjust($event.target)" type="text" v-model.trim="form.desc" class="form-control textarea-resize"
                              id="except-textarea" placeholder="Введите небольшое описание">
                    </textarea>
                  </form-group>

                  <div class="form-group">
                    <label for="users-roles">Пользователи в роли</label>
                    <ul v-if="users.length" class="users-roles">
                      <li v-for="user in users" :class="[{'delete':checkDeleting(user.id)},'d-flex']">
                        <p>{{user.name}}</p>
                        <button @click="deleteUser(user.id, user.added)">
                          <i v-if="checkDeleting(user.id)" class="fa-solid fa-rotate-left"></i>
                          <i v-else-if="user.added" class="fa-solid fa-trash"></i>
                          <i v-else class="fa-solid fa-xmark"></i>
                        </button>
                      </li>
                    </ul>
                    <p v-else>Нет пользователей</p>

                  </div>
                </div>
                <div class="card-footer"><div class="form-group mt-3">
                  <button class="btn btn-outline-dark mr-2" @click="modals.userAdd.show = true">Создать нового пользователя</button>
                  <button class="btn btn-outline-dark" @click="modals.usersList.show = true">Добавить существующего</button>
                </div></div>
              </div>
            </div>

            <div class="col-md-6 d-flex">
              <div class="card card-primary flex-fill">
                <div class="card-body">
                  <permission-table
                    :permissions="permissions"
                    :role_permissions.sync="form.permissions_group"
                    :show.sync="modals.warning.show"
                    :action.sync="modals.warning.action"
                  />
                </div>
                <!-- /.card-body -->
                <div class="card-footer">
                  <button-loader :fetch="sendBtn" :loading="loading">
                    Сохранить
                  </button-loader>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
    <warning-modal :action="modals.warning.action"
                   :show.sync="modals.warning.show"
                   :disable-closing.sync="modals.warning.disable_closing"/>
    <users-list-modal :show.sync="modals.usersList.show"
                      :user-add-modal.sync="modals.userAdd.show"
                      :selected-users.sync="form.users"/>
    <user-add-modal :show.sync="modals.userAdd.show" @create-user="createUser"/>
  </div>
</template>

<script>
import PermissionTable from "../../../components/admin/roles/PermissionTable";
import WarningModal from "../../../components/admin/roles/WarningModal";
import UsersListModal from "../../../components/admin/roles/UsersListModal";
import UserAddModal from "../../../components/admin/roles/UserAddModal";
import {mapGetters} from "vuex";
import {maxLength, minLength, required} from "vuelidate/lib/validators";

export default {
  name: 'addPost',
  middleware: 'permission',
  meta: {
    permission: 'role.edit'
  },
  components: {
    UserAddModal,
    UsersListModal,
    PermissionTable,
    WarningModal
  },
  layout: 'Admin',
  // key(route) {
  //   return route.fullPath
  // },
  head() {
    return {
      title: 'Создание нового поста',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Создание нового поста',
        },
      ],
    }
  },

  async asyncData({$api, params, store}) {
    try {
      const [role, permissions] = await Promise.all([
        $api.adminRoles.edit(params.id),
        $api.adminRoles.permissions()
      ])
      const users = role.users
      store.commit('role/setUsers', role.users)
      delete role.users

      return {
        form:role,
        permissions,
        title: role.name,
        copyRole: {...role},
        copyUsers: [...users]
      }
    } catch (err) {console.log(err)}
  },

  data() {
    return {
      BASE_URL: process.env.API_BASE_URL,
      loading: false,
      deletedUsers: [],
      new_user: [],
      modals: {
        usersList: {
          show: false,
        },
        userAdd: {
          show: false,
        },
        warning: {
          show: false,
          notice: false,
          action: null,
          disable_closing: false
        }
      },
    }
  },

  validations() {
    return {
      form: {
        name: {
          required,
          minLength: minLength(4),
          maxLength: maxLength(255)
        },
        desc: {
          maxLength: maxLength(255)
        },
      }
    }
  },

  computed: {
    ...mapGetters({
        users : "role/getUsers"
      // loading: "admin/posts/getPostsLoad",
      // slug: "admin/posts/getSlug",
      // selectTags: "admin/posts/getTags",
    }),
  },

  methods: {
    async sendBtn() {
      this.$v.$touch()
      if (this.$v.$invalid) return
      this.loading = true
      try {
        let users = this.otherFormatData()

        await this.$api.adminRoles.update(this.$route.params.id, this.formData(users))
        await this.$nuxt.refresh()

        this.$v.$reset()
        this.$toaster.success('Данные успешно сохраннены!')
      } catch (err) { console.log(err)}
      this.loading = false
    },

    otherFormatData() {
      let users = []

      this.users.forEach(user => {
        if(user.id) users.push(user.id)
      })

      this.deletedUsers.forEach(id => {
        let index = users.indexOf(id);
        if (index !== -1) users.splice(index,1)
      })

      let data = {
        name: this.form.name,
        desc: this.form.desc,
        users
      }

      if(this.new_user.length) {
        data.new_user = this.new_user
        data.new_user.forEach(val => {
          if(val.avatar === '') delete val.avatar
          delete val.added
        })
      }
      console.log('data', data)

      return data
    },

    formData(data) {
      let formData = new FormData();

      Object.entries(data).forEach(val => {
          if(Array.isArray(val[1]) && val[1].length && val[0] !== 'users') {
            for (let i = 0; i < val[1].length; i++) {
              for (let key of Object.keys(val[1][i])) {
                formData.append(`new_user[${i}][${key}]`, val[1][i][key]);
              }
            }
          }else if (val[0] === 'users') {
            if(!val[1].length) return
            val[1].forEach(function(value) {
              formData.append("users[]", value)
            })
          }else {
            formData.append(val[0], val[1])
          }

      })
      formData.append('_method', 'PUT');

      return formData
    },

    checkDeleting (id){
      return this.deletedUsers.includes(id)
    },

    createUser(user) {
      this.$store.commit('role/pushUsers', [user])
      this.new_user.push(user)
    },

    deleteUser(id, added) {

      if(added) {
        this.$store.commit('role/deleteUsers', id)
        this.new_user.splice(this.new_user.findIndex(
          object => object.id === id), 1)
        return
      }

      var index = this.deletedUsers.indexOf(id);
      if (index === -1) {
        console.log(id, added, this.deletedUsers)
        this.deletedUsers.push(id);
      } else {
        this.deletedUsers.splice(index, 1);
      }
    },

    textAreaAdjust(el) {
      // el.style.height = "1px";
      // el.style.height = (25+el.scrollHeight)+"px";
      el.style.height =
        (el.scrollHeight > el.clientHeight)
          ? (25+ el.scrollHeight)+"px"
          : "100px";
    },

  },

  beforeRouteLeave (to, from , next) {
    console.log(this.users ,'===', this.copyUsers)
    console.log(this.form ,'===', this.copyRole)
    if ((this.form.name !== this.copyRole.name
      || this.form.desc !== this.copyRole.desc
      || this.users.length !== this.copyUsers.length)
      && to.name !== 'admin-posts-slug') {

      if (window.confirm('Вы действительно хотите уйти? у вас есть несохраненные изменения!')) {
        next()
      } else {
        next(false)
      }
    } else next()
  }
  // beforeDestroy() {
  //   this.$store.commit('role/setUsers', [])
  // }
}
</script>

<style>

textarea {
  height: 125px;
}

.users-roles li:not(:last-child) {
  margin-bottom: 15px;
}

.users-roles li {
  padding: 10px;
  justify-content: space-between;
  border: 1px solid #cecece;
  border-radius: 5px;
}

.users-roles li.delete {
  border-color: #dc3545;
  background: rgb(255 0 0 / 8%);;
}

.users-roles li.delete i{
  color: #dc3545;
}

.users-roles li p {
  margin: 0;
}

.users-roles li button {
  background: none;
  border: none;
}

.users-roles li button:hover i {
  color: #dc3545;
}

.users-roles li button i {
  margin: 0;
  font-size: 15px;
}

</style>
