<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">{{ title }}</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <AdminUiBreadcrumbs :name="['Пользователи', title]" />
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div>
    </section>
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 col-sm-6 d-flex align-items-stretch flex-column">
            <div class="card bg-light d-flex flex-fill">
              <div class="card-header text-muted border-bottom-0 d-flex justify-content-between">
                {{ form.role ? form.role : 'Пользователь'}}
                <p v-if="getTime()" class="ml-auto mb-0">{{ getTime() }}</p>
              </div>
              <div class="card-body pt-0">
                <div class="row">
                  <div class="col-3 text-center">
                    <img height="140" width="140"
                         :src="imgShow"
                         alt="user-avatar"
                         class="img-circle avatar">
                  </div>
                  <div class="col-7 flex-column d-flex justify-content-center">
                    <h2 class="lead"><b>{{ title }}</b></h2>
                    <p class="text-muted text-sm"><b>Email: </b> {{ email }} </p>
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
                <form-group :validator="$v.form.confirm_password" label="Подтвердите Пароль">
                  <input v-model="form.confirm_password" type="password" class="form-control" id="confirm_password" placeholder="Введите пароль еще раз">
                </form-group>
              </div>
            </div>
          </div>

          <div class="col-md-6 d-flex">
            <div class="card card-primary flex-fill">
              <div class="card-body">
                <form-group :validator="$v.form.avatar" label="Аватар">
                  <label>Аватар</label>
                  <div class="custom-file">
                    <input @change="onFileChange" type="file" placeholder="Довавьте изображение" class="custom-file-input" id="customFile">
                    <label class="custom-file-label" for="customFile">Добавьте изображение...</label>
                  </div>
                </form-group>
                <div class="form-group">
                  <label for="meta-keywords">Роль</label>
                  <select v-model="form.role_id" class="custom-select">
                    <option value="">-- Без роли --</option>
                    <option :value="role.id" v-for="role in roles.data">
                      {{role.name}}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Статус</label>
                  <select v-model="status" class="custom-select">
                    <option value="" selected>- Выбрать статус -</option>
                    <option value="0">Активен</option>
                    <option value="1">Заблокирован</option>
                    <option v-for="option in options" :value="option.date">{{ option.text }}</option>
                  </select>
                </div>
              </div>
              <!-- /.card-body -->
              <div class="card-footer">
                <button @click="sendBtn()" class="btn btn-primary float-right btn-with-loader">
                  <span v-if="!loading">Сохранить</span>
                  <Loader width="20px" v-else/>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script>
import {required, minLength, maxLength, helpers, email, sameAs} from 'vuelidate/lib/validators'

let allowedExtension = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

const fileImg = (value) => {
  if (typeof value === 'string') return true
  return !helpers.req(value) || allowedExtension.indexOf(value.type) > -1
}

const filSize = (value) => {
  if (typeof value === 'string') return true
  return !helpers.req(value) || (value.size / 1024 / 1024) < 1
}

export default {
  layout: 'Admin',
  middleware: 'permission',
  meta: {
    permission: 'user.edit'
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

  async asyncData({$api, params}) {
    const [user,roles] = await Promise.all([
      $api.adminUsers.edit(params.id),
      $api.adminRoles.index(),
    ])

    user.role_id = user.role.id ?? ''

    return {
      form:user,
      title: user.name,
      roles,
      imgShow: user.avatar,
      banned_until: user.banned_until,
      banned: user.status,
      copy: {...user},
      email: user.email
    }
  },

  data() {
    return {
      BASE_URL: process.env.API_BASE_URL,
      status: '',
      loading: false,
      options: [
        {
          date: this.getDate('week'),
          text: 'Заблокирован на неделю'
        },
        {
          date: this.getDate('week', 2),
          text: 'Заблокирован на 2 недели'
        },
        {
          date: this.getDate('month'),
          text: 'Заблокирован на месяц'
        },
      ],
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
    getDate(name, number = null) {
      let date = new Date(),
        setDate;

      if (name === 'week') {
        number =  number ? 7 * number : 7

        setDate = new Date(date.setDate(date.getDate() + number))
      } else if (name === 'month') {
        number =  number ? number : 1

        setDate = new Date(date.setMonth(date.getMonth()+number))
      }

      return setDate.toISOString();
    },

    getTime() {
      if (this.banned_until) {
        return 'Заблокирован до: ' + this.dataFormat(this.banned_until)
      } else if (this.banned === 1) {
        return 'Заблокирован'
      } else {
        return false
      }
    },

    dataFormat(val) {
      var today = new Date(val);
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //January is 0!
      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = '0' + dd
      }
      if (mm < 10) {
        mm = '0' + mm
      }
      return dd + '/' + mm + '/' + yyyy;
    },

    async sendBtn() {
      this.$v.$touch()
      if (this.$v.$invalid) return

      const data = [
        this.$route.params.id,
        this.formData(this.form)
      ]

      try {
        this.loading = true

        await this.$api.adminUsers.update(...data)
        await this.$nuxt.refresh()

        this.$v.$reset()
        this.$toaster.success('Данные успешно сохраннены!')
      } catch (err) {console.log(err)}

      this.loading = false
    },

    formData(data) {
      let user = data
      let formData = new FormData();
      delete user.banned_until
      user.status = this.status

      Object.entries(user).forEach(val => {
        formData.append(val[0], val[1])
      })
      formData.append('_method', 'PUT');

      return formData
    },

    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
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
    console.log(this.form.desc ,'===', this.copy.desc)
    if ((this.form.name !== this.copy.name
        || this.form.email !== this.copy.email
        || this.form.avatar !== this.copy.avatar)
      && to.name !== 'admin-posts-id') {

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
</style>
