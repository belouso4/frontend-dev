<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Редактирование роли</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><nuxt-link to="/admin"><i class="fa-solid fa-house"></i></nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/admin/posts">Посты</nuxt-link></li>
              <li class="breadcrumb-item active">Создание нового поста</li>
            </ol>
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

                  <div class="form-group">
                    <label for="header-text">Название роли</label>
                    <input v-model="form.name" type="text" class="form-control" id="header-text" placeholder="Введите заголовок">
<!--                    <p class="error-text" v-if="!validations.name.valid">{{validations.name.message}}</p>-->
                  </div>
                  <div class="form-group">
                    <label>Описание</label>
                    <textarea type="text" v-model="form.desc" class="form-control"
                              id="except-textarea" placeholder="Введите небольшое описание">

                    </textarea>
                  </div>
                  <div class="form-group">
                    <label for="users-roles">Пользователи в роли</label>
                    <ul class="users-roles">
                      <li v-for="user in users" :class="[{'delete':checkDeleting(user.id)},'d-flex']">
                        <p>{{user.name}}</p>
                        <button @click="deleteUser(user.id, user.added)">
                          <i v-if="checkDeleting(user.id)" class="fa-solid fa-rotate-left"></i>
                          <i v-else-if="user.added" class="fa-solid fa-trash"></i>
                          <i v-else class="fa-solid fa-xmark"></i>
                        </button>
                      </li>
                    </ul>
                    <div class="form-group mt-3">
                      <button class="btn btn-outline-dark mr-2" @click="modals.userAdd.show = true">Создать нового</button>
                      <button class="btn btn-outline-dark" @click="modals.usersList.show = true">Добавить существующего</button>
                    </div>
                  </div>
                </div>
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
                  <button @click="sendBtn" type="submit" class="btn btn-dark float-right">Сохранить</button>
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
  key(route) {
    return route.fullPath
  },
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

  async asyncData({app, params, store}) {
    const [role, permissions] = await Promise.all([
      app.$api.adminRoles.edit(params.id),
      app.$api.adminRoles.permissions()
    ])
    store.commit('role/setUsers', role.users)
    delete role.users

    return {form:role, permissions}
  },

  created() {

  },

  data() {
    return {
      BASE_URL: process.env.API_BASE_URL,
      send: false,
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

  watch:{
    // 'form.name':  {
    //   handler: function (after, before) {
    //     this.validations.name.valid = true
    //   },
    //   deep: true
    // },
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
      if (this.validation()) {
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
        //
        if(this.new_user.length) {
          data.new_user = this.new_user
          data.new_user.forEach(val => {
            if(val.avatar === '') delete val.avatar
            delete val.added
          })
        }

        console.log(data)
        let roles = await this.$api.adminRoles.update(this.$route.params.id, this.formData(data))
        console.log(roles)
        this.$router.push({path: '/admin/roles'})
      }
    },

    formData(data) {
      let formData = new FormData();

      Object.entries(data).forEach(val => {
        if(val[1] !== '') {
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

    validation() {
      let validNewPostForm = true;

      if( this.form.name == '' ){
        validNewPostForm = false;
        // this.validations.name.valid = false;
        // this.validations.name.message = 'Введите название'
      }else{
        // this.validations.name.valid = true;
        // this.validations.name.message = '';
      }

      return validNewPostForm;
    },
  },
  // beforeDestroy() {
  //   this.$store.commit('role/setUsers', [])
  // }
}
</script>

<style>

textarea {
  height: 125px;
}

.content ul input{
  flex: 1;
  padding: 5px;
  border: none;
  outline: none;
  font-size: 16px;
}

.error-text {
  color: red;
  margin-top: 4px;
}

ul.select-tags {
  border: 1px solid #cecece;
  margin-top: 5px;
  border-radius: 5px;
  padding: 11px 20px 20px 13px;
  position: absolute;
  width: 100%;
  bottom: -192px;
  right: 0;
  left: 0;
  height: 187px;
  overflow: hidden;
  overflow-y: auto;
  z-index: 99999;
  background: #fff;
}

.select-tags li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-tags li span {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  transition: all .3s ease;
  display: block;
  cursor: pointer;
}

.select-tags li span:hover {
  background: #ff3c3c;;
  color: #fff;
  transition: all .3s ease;
}

.select-tags li:not(:last-child) {
  margin-bottom: 5px;
}

.select-tags li p {
  cursor: pointer;
}

.create-new-tag {
  margin-top: 10px;
}

.tags-input .inputs {
  display: flex;

}

.tags-input .inputs i {
  font-size: 20px;
  cursor: pointer;
}

/* style table permissions */

.permissions-table {
  border-radius: 6px;
  border: 2px solid #d3dae4;
}

.permissions-table_header {
  display: flex;
  padding: 12px;
  border-bottom: 2px solid #d3dae4;
}

.permissions-table_header .name {
  flex-grow: 1;
}

.v-icon {
  width: 24px;
}

.permissions-table_header .v-icon+.v-icon {
  margin-left: 20px;
}

.btn-all-collection {
  border: none;
  width: 100%;
  height: 48px
}

.btn-all-collection i {
  vertical-align: middle;
  margin-left: 2px;
}

.permissions-table_body .elem-permission img{
  width: 19px;
}

.permissions-table_body .elem-permission{
  cursor: pointer;
  text-align: center;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.permissions-table_body .elem-permission:hover{
  background: #ededed;
  transition: background 0.3s ease;
}

.permissions-table_body .elem-permission.disabled{
  opacity: .5;
  cursor: default;
}
.permissions-table_body .elem-permission.disabled:hover{
  background: transparent;
}

.permissions-table_body .permissions-table_body__row{
  display: flex;
  height: 48px;
  padding: 0 12px;
  align-items: center;
}

.permissions-table_body .name{
  flex-grow: 1;
}

.permissions-table_body .v-icon+.v-icon{
  margin-left: 20px;
}

.permissions-table_footer {
  padding: 8px;
  font-size: 14px;
}

.permissions-table_footer span {
  font-size: 15px;
  font-weight: 600;
}

.users-roles {

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
