<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Создание нового поста</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
<!--              <li class="breadcrumb-item"><nuxt-link to="/admin"><i class="fa-solid fa-house"></i></nuxt-link></li>-->
<!--              <li class="breadcrumb-item"><nuxt-link to="/admin/posts">Посты</nuxt-link></li>-->
<!--              <li class="breadcrumb-item active">Создание нового поста</li>-->
              <li v-for="brc in $store.state.breadcrumbs.breadcrumbs" :class="['breadcrumb-item', {'active': !(!!brc.to)}]">
                <nuxt-link v-if="!!brc.to" :to="brc.to.path">
                  <i v-if="brc.to.path === '/admin'" class="fa-solid fa-house"></i>
                  <span v-else>{{ brc.text }}</span>
                </nuxt-link>
                <span v-else>{{ brc.text }}</span>
              </li>
<!--              <li class="breadcrumb-item"><nuxt-link to="/admin/posts"></nuxt-link></li>-->
<!--              <li class="breadcrumb-item active">Создание нового поста</li>-->
            </ol>
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
                Digital Strategist
                <p v-if="getTime()" class="ml-auto">{{ getTime() }}</p>
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
                    <h2 class="lead"><b>{{ form.name }}</b></h2>
                    <p class="text-muted text-sm"><b>Email: </b> {{ form.email }} </p>
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
<!--                    <p class="error-text" v-if="!validations.title.valid">{{validations.title.message}}</p>-->
                </div>
                <div class="form-group">
                  <label for="Email">Электронная почта</label>
                  <input v-model="form.email" type="text" class="form-control" id="Email" placeholder="Введите Email">
<!--                    <p class="error-text" v-if="!validations.title.valid">{{validations.title.message}}</p>-->
                </div>
                <div class="form-group">
                  <label for="password">Введите новый пароль</label>
                  <input v-model="form.password" type="password" class="form-control" id="password" placeholder="Введите Пароль">
<!--                    <p class="error-text" v-if="!validations.title.valid">{{validations.title.message}}</p>-->
                </div>
                <div class="form-group">
                  <label for="confirm_password">Подтвердите Пароль</label>
                  <input v-model="form.confirm_password" type="password" class="form-control" id="confirm_password" placeholder="Введите пароль еще раз">
<!--                    <p class="error-text" v-if="!validations.title.valid">{{validations.title.message}}</p>-->
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
                    <input @change="onFileChange" type="file" placeholder="Довавьте изображение" class="custom-file-input" id="customFile">
                    <label class="custom-file-label" for="customFile">Добавьте изображение...</label>
<!--                      <p class="error-text" v-if="!validations.img.valid">{{validations.img.message}}</p>-->
                  </div>
                </div>
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
import { mapMutations } from 'vuex';

export default {
  name: 'addPost',
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

  created() {
    this.setBreadcrumbs([
      { text: 'Own-house', to: { path: '/admin' }},
      { text: 'Users', to: { path: '/admin/users' }},
      { text: ':user' } // placeholder
    ]);


    this.replaceBreadcrumb({
      find: ':user',
      replace: { text: this.form.name }
    });
  },

  async asyncData({app, params}) {
    const [user,roles] = await Promise.all([
      app.$api.adminUsers.edit(params.id),
      app.$api.adminRoles.index(),
    ])

    user.role_id = user.role.id ?? ''

    return {
      form:user,
      roles,
      imgShow: user.avatar,
      banned_until: user.banned_until,
      banned: user.status
    }
  },

  data() {
    return {
      BASE_URL: process.env.API_BASE_URL,
      send: '',
      status: '',
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
      validations: {
        title: {
          valid: true,
          message: ''
        },
        desc: {
          valid: true,
          message: ''
        },
        img: {
          valid: true,
          message: ''
        },
      },
    }
  },

  methods: {
    ...mapMutations('breadcrumbs', {
      setBreadcrumbs: 'set',
      pushBreadcrumb: 'push',
      popBreadcrumb: 'pop',
      replaceBreadcrumb: 'replace',
      emptyBreadcrumbs: 'empty'
    }),

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
      return yyyy + '/' + mm + '/' + dd;
    },

    async sendBtn() {
      const data = [
        this.$route.params.id,
        this.formData(this.form)
      ]

      await this.$api.adminUsers.update(...data)
      await this.$nuxt.refresh()
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

    // validation() {
    //   let validNewPostForm = true;
    //   let allowedExtension = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    //
    //   if( this.form.title == '' ){
    //     validNewPostForm = false;
    //     this.validations.title.valid = false;
    //     this.validations.title.message = 'Введите заголовок'
    //   }else{
    //     if( this.form.title.length < 3 ){
    //       validNewPostForm = false;
    //       this.validations.title.valid = false;
    //       this.validations.title.message = 'Заголовок не может быть меньше 5 символов'
    //     }else{
    //       this.validations.title.valid = true;
    //       this.validations.title.message = '';
    //     }
    //   }
    //
    //   if( this.form.desc == '' ){
    //     validNewPostForm = false;
    //     this.validations.desc.valid = false;
    //     this.validations.desc.message = 'Введите описание'
    //   }else{
    //     if( this.form.desc.length < 3 ){
    //       validNewPostForm = false;
    //       this.validations.desc.valid = false;
    //       this.validations.desc.message = 'Описание не может быть меньше 3 символов'
    //
    //     }else{
    //       this.validations.desc.valid = true;
    //       this.validations.desc.message = '';
    //     }
    //   }
    //   if(this.form.img == ''){
    //     validNewPostForm = false;
    //     this.validations.img.valid = false;
    //     this.validations.img.message = 'Добавьте изображение'
    //   }else{
    //     let condition = allowedExtension.indexOf(this.form.img.type) >-1
    //     condition = typeof this.form.img == 'string' ? true : condition
    //     if( condition ){
    //       this.validations.img.valid = true;
    //       this.validations.img.message = '';
    //
    //     }else{
    //       validNewPostForm = false;
    //       this.validations.img.valid = false;
    //       this.validations.img.message = 'Поддерживаемые типы файлов - jpeg, jpg, png, gif'
    //     }
    //   }
    //
    //   return validNewPostForm;
    // },

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
