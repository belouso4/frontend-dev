<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Создание нового пользователя</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <AdminUiBreadcrumbs :name="['Пользователи', 'Создание пользователя']" />
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div>
    </section>
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 col-sm-6 d-flex align-items-stretch flex-column">
            <div class="card bg-light d-flex flex-fill">
              <div class="card-header text-muted border-bottom-0">
                Пользователь
              </div>
              <div class="card-body pt-0">
                <div class="row">
                  <div class="col-3 text-center">
                    <img height="140"
                         width="140"
                         :src="imgShow"
                         alt="user-avatar"
                         class="img-circle avatar">
                  </div>
                  <div class="col-7 flex-column d-flex justify-content-center">
                    <h2 class="lead"><b>Имя Фамиля</b></h2>
                    <p class="text-muted text-sm"><b>Email: </b> email@gmail.com </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 d-flex">
            <div class="card card-primary flex-fill">
              <div class="card-body">
                <form-group :validator="$v.form.name" label="Имя & Фамилия">
                  <input v-model="form.name" type="text" class="form-control" id="header-text" placeholder="Введите заголовок">
                </form-group>
                <form-group :validator="$v.form.email" label="Электронная почта">
                  <input v-model="form.email" type="text" class="form-control" id="Email" placeholder="Введите Email">
                </form-group>
                <form-group :validator="$v.form.password" label="Введите пароль">
                  <input v-model="form.password" type="password" class="form-control" id="password" placeholder="Введите Пароль">
                </form-group>
                <form-group :validator="$v.form.confirm_password" label="Подтвердите Пароль" attribute="для подтверждения пароля">
                  <input v-model="form.confirm_password" type="password" class="form-control" id="confirm_password" placeholder="Введите пароль еще раз">
                </form-group>
              </div>
            </div>
          </div>

          <div class="col-md-6 d-flex">
            <div class="card card-primary flex-fill">
              <div class="card-body">

                <form-group :validator="$v.form.avatar" label="Аватар">
                  <div class="custom-file">
                    <input @change="onFileChange"
                           type="file"
                           placeholder="Довавьте изображение"
                           class="custom-file-input"
                           id="customFile">
                    <label class="custom-file-label" for="customFile">Добавьте изображение...</label>
                  </div>
                </form-group>

                <div class="form-group">
                  <label for="meta-keywords">Роль</label>
                  <select v-model="form.role_id" class="custom-select">
                    <option value="">--Выбрать роль--</option>
                    <option v-for="(role, index) in roles" :key="index" :value="role.id">
                      {{role.name}}
                    </option>
                  </select>
                </div>

              </div>
              <!-- /.card-body -->
              <div class="card-footer">
                <button-loader @fetch="sendBtn" :loading="loading">
                  Сохранить
                </button-loader>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { required, minLength, maxLength, helpers, email, sameAs} from 'vuelidate/lib/validators'

let allowedExtension = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

const fileImg = (value) => !helpers.req(value) || allowedExtension.indexOf(value.type) > -1
const filSize = (value) => !helpers.req(value) || (value.size / 1024 / 1024) < 1

export default {
  layout: 'Admin',
  meta: {
    permission: 'user.create'
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

  async asyncData({$api}) {
    try {
      const roles = (await $api.adminRoles.index()).data;
      return {roles}
    } catch (err) {console.log(err)}
  },

  data() {
    return {
      imgShow: process.env.API_BASE_URL_IMG + '/avatar.png',
      loading: false,
      form: {
        name: '',
        email: '',
        avatar: '',
        password: '',
        confirm_password: '',
        role_id: '',
      }
    }
  },

  validations() {
    return {
      form: {
        name: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(255)
        },
        email: {
          required,
          email,
          maxLength: maxLength(255)
        },
        password: {
          required,
          minLength: minLength(6),
          maxLength: maxLength(255)
        },
        confirm_password: {
          sameAsPassword: sameAs('password')
        },
        avatar: {
          fileImg,
          filSize
        }
      }

    }
  },

  methods: {
    async sendBtn() {
      this.$v.$touch()
      if (this.$v.$invalid) return

      try {
        this.loading = true

        const user = await this.$api.adminUsers.create(this.formData(this.form))
        await this.$router.push({
          path: '/admin/users/'+user.id
        })

        this.$v.$reset()
        this.$toaster.success('Данные успешно сохраннены!')
      } catch (err) {console.log(err)}

      this.loading = false
    },

    formData(data) {
      let formData = new FormData();

      Object.entries(data).forEach(val => {
        formData.append(val[0], val[1])
      })
      return formData
    },

    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (this.$v.form.avatar.$invalid)
        return;

      if (!files.length)
        return;

      let reader = new FileReader();
      let vm = this;
      reader.onload = (e) => {
        vm.imgShow = e.target.result;
      };

      reader.readAsDataURL(files[0]);
      this.form.avatar = files[0]
    },
  },
  beforeRouteLeave (to, from , next) {
    if ((this.form.name !== '' || this.form.email !== '' || this.form.avatar !== '') && to.name !== 'admin-users-id') {
      if (window.confirm('Вы действительно хотите уйти? у вас есть несохраненные изменения!')) {
        next()
      } else {
        next(false)
      }
    } else next()
  }
}
</script>

<style>

</style>
