<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Создание нового поста</h1>
          </div><!-- /.col -->
<!--          <div class="col-sm-6">-->
<!--            <ol class="breadcrumb float-sm-right">-->
<!--              <li class="breadcrumb-item"><nuxt-link to="/admin"><i class="fa-solid fa-house"></i></nuxt-link></li>-->
<!--              <li class="breadcrumb-item"><nuxt-link to="/admin/posts">Посты</nuxt-link></li>-->
<!--              <li class="breadcrumb-item active">Создание нового поста</li>-->
<!--            </ol>-->
<!--          </div>&lt;!&ndash; /.col &ndash;&gt;-->
          <div class="col-sm-6">
            <Breadcrumbs :title="'Создание нового поста'" />
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
                Digital Strategist
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
                    <h2 class="lead"><b>Nicole Pearson</b></h2>
                    <p class="text-muted text-sm"><b>Email: </b> fsfsewefw@mail.ru </p>
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
                <div class="form-group">
                  <label for="header-text">Имя & Фамилия</label>
                  <input v-model="form.name" type="text" class="form-control" id="header-text" placeholder="Введите заголовок">
                </div>
                <div class="form-group">
                  <label for="Email">Электронная почта</label>
                  <input v-model="form.email" type="text" class="form-control" id="Email" placeholder="Введите Email">
                </div>
                <div class="form-group">
                  <label for="password">Введите пароль</label>
                  <input v-model="form.password" type="password" class="form-control" id="password" placeholder="Введите Пароль">
                </div>
                <div class="form-group">
                  <label for="confirm_password">Подтвердите Пароль</label>
                  <input v-model="form.confirm_password" type="password" class="form-control" id="confirm_password" placeholder="Введите пароль еще раз">

                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6 d-flex">
            <div class="card card-primary flex-fill">
              <div class="card-body">
                <div class="form-group">
                  <label>Аватар</label>
                  <div class="custom-file">
                    <input @change="onFileChange"
                           type="file"
                           placeholder="Довавьте изображение"
                           class="custom-file-input"
                           id="customFile">
                    <label class="custom-file-label" for="customFile">Добавьте изображение...</label>
                  </div>
                </div>
                <div class="form-group">
                  <label for="meta-keywords">Роль</label>
                  <select v-model="form.role_id" class="custom-select">
                    <option value="">--Выбрать роль--</option>
                    <option v-for="(role, index) in roles" :key="index" :value="role.id">
                      {{role.name}}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Статус ? не реализованный функционал ?</label>
                  <select class="custom-select">
                    <option>Активен</option>
                    <option>Заблокирован</option>
                    <option>Черновик</option>
                  </select>
                </div>
              </div>
              <!-- /.card-body -->
              <div class="card-footer">
                <button @click="sendBtn" type="submit" class="btn btn-primary float-right">Сохранить</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Breadcrumbs from "../../../components/admin/ui/Breadcrumbs";
export default {
  components: {Breadcrumbs},
  name: 'wfwefwefef',
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

  async asyncData({app, params, env, error}) {
    const roles = await app.$api.adminRoles.index();
    return {roles:roles.data}
  },

  data() {
    return {
      // BASE_URL: process.env.API_BASE_URL,
      imgShow: process.env.API_BASE_URL_IMG + '/avatar.png',
      form: {
        name: '',
        email: '',
        avatar: '',
        password: '',
        confirm_password: '',
        role_id: '',
        validations: {
          name: {
            valid: true,
            message: ''
          },
          email: {
            valid: true,
            message: ''
          },
          password: {
            valid: true,
            message: ''
          },
        },
      }

    }
  },
  created() {

  },


  methods: {


    sendBtn() {

      this.$api.adminUsers.create(this.formData(this.form)).then(res => {
        this.$router.push({
              path: '/admin/users/'+res.id
        })
      })
      // if (this.validation()) {
      // const data = [this.formData(this.form), this.$route.params.slug]
      // await this.$api.adminPosts.update(...data).then((post) => {
      //   this.send = true
      //   this.$router.push({
      //     path: '/admin/post/'+post.slug
      //   })
      // })
      // }
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

.avatar {
  object-fit: cover;
}

</style>
