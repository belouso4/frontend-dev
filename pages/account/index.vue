<template>
  <section class="section-cabinet">
    <div class="container">
      <div class="main-header">
        <h1> Личный кабинет</h1>
        <ul class="breadcrumbs">
          <li>
            <a href="">OwnHouse</a>
          </li>
          <li>
            <p>Личны кабинет</p>
          </li>
        </ul>
      </div>
      <div class="flex-position">
        <aside>
          <div class="aside-title">
            Настройки
          </div>
          <ul class="menu">
            <li>
              <a>Профиль</a>
            </li>
            <li>
              <a>Рекомендации</a>
            </li>
            <li>
              <a>Настройки</a>
            </li>
            <li>
              <p @click="logout">Выйти</p>
            </li>
          </ul>
        </aside>
        <div class="right-content">

          <form action="" @submit.prevent="sendForm">
            <div class="user-avatar" @click="$refs.file.click()">
              <img :src="form.avatar" alt="">
              <input @change="onFileChange" ref="file" type="file" style="display: none">
              <div class="overlay-avatar"><i class="fa-solid fa-camera"></i></div>
            </div>
            <div class="error"
                 v-if="!validations.avatar.valid"
                 style="color: red">
              {{ validations.avatar.message }}
            </div>
            <div class="form-group">
              <label for="">Изменить имя</label>
              <input type="text" placeholder="Введите Имя" v-model="form.name">
              <div class="error"
                   v-if="!validations.name.valid"
                   style="color: red">
                {{ validations.name.message }}
              </div>
            </div>
            <div class="form-group">
              <label for="">Старый пароль</label>
              <input type="text" placeholder="Введите старый пароль" v-model="form.existing_password">
              <div class="error"
                   v-if="!validations.existing_password.valid"
                   style="color: red">
                {{validations.existing_password.message}}
              </div>
            </div>
            <div class="form-group">
              <label for="">Новый пароль</label>
              <input type="text" placeholder="Введите новый пароль" v-model="form.new_password">
              <Meter :value="passwordStrength"></Meter>
              <div class="error"
                   v-if="!validations.new_password.valid"
                   style="color: red">
                {{validations.new_password.message}}
              </div>
            </div>
            <div class="form-group">
              <label for="">Новый пароль</label>
              <input type="text" placeholder="Введите пароль повторно" v-model="form.confirm_password">
              <div class="error"
                   v-if="!validations.confirm_password.valid"
                   style="color: red">
                {{validations.confirm_password.message}}
              </div>
            </div>
            <div class="form-group">
              <label for="">Изменить Email</label>
              <input type="text" placeholder="Email" v-model="form.email">
              <div class="error"
                   v-if="!validations.email.valid"
                   style="color: red">
                {{validations.email.message }}
              </div>
            </div>
            <div class="form-group">
              <button>Сохранить</button>
            </div>

          </form>

        </div>

      </div>
    </div>
  </section>
</template>

<script>
import zxcvbn from 'zxcvbn'

    export default {
      layout: 'AppMain',
      middleware: ['auth', 'verified'],
      data(){
        return {
          imgShow: 'avatar.png',
          BASE_URL: process.env.API_BASE_URL,
          form: {
            avatar: this.$auth.user.avatar,
            name: this.$auth.user.name,
            existing_password: '',
            new_password: '',
            confirm_password: '',
            email: this.$auth.user.email,
          },

          validations: {
            name: {
              valid: true,
              message: ''
            },
            email: {
              valid: true,
              message: ''
            },
            existing_password: {
              valid: true,
              message: ''
            },
            new_password: {
              valid: true,
              message: ''
            },
            confirm_password: {
              valid: true,
              message: ''
            },
            avatar: {
              valid: true,
              message: ''
            }
          },
        }
      },

      computed: {
        passwordStrength () {
          return zxcvbn(this.form.new_password).score
        },
      },

      methods: {
        async logout(){
            await this.$auth.logout();
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

        async sendForm() {
          if(true) {
            let formData = new FormData();

            Object.entries(this.form).forEach(val => {
              formData.append(val[0], val[1])
            })

            formData.append('_method', 'PUT');

            await this.$api.user.update(this.$auth.user.id, formData)

            this.$auth.fetchUser();
          }

        },

        validateProfileUpdates(){
          let validForm = true;

          if( this.form.name == '' ){
            validForm = false;
            this.validations.name.valid = false;
            this.validations.name.message = 'В этом поле необходимо указать имя.'
          }else{
            this.validations.name.valid = true;
            this.validations.name.message = '';
          }

          if( this.form.email == ''
            || !this.form.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ){
            validForm = false;
            this.validations.email.valid = false;
            this.validations.email.message = 'Для регистрации необходимо ввести действующий адрес электронной почты.'
          }else{
            this.validations.email.valid = true;
            this.validations.email.message = '';
          }

          if( this.form.new_password != ''
            && this.form.existing_password == '' ){
            validForm = false;
            this.validations.existing_password.valid = false;
            this.validations.existing_password.message = 'Пожалуйста, введите ваш существующий пароль.';
          }else{
            this.validations.existing_password.valid = true;
            this.validations.existing_password.message = '';
          }

          if( this.form.new_password != ''
            && this.passwordStrength < 4 ){
            validForm = false;
            this.validations.new_password.valid = false;
            this.validations.new_password.message = 'Необходимо ввести безопасный пароль.'
          }else{
            this.validations.new_password.valid = true;
            this.validations.new_password.message = '';
          }

          if( this.form.confirm_password != ''
            && this.form.confirm_password != this.form.new_password ){
            validForm = false;
            this.validations.confirm_password.valid = false;
            this.validations.confirm_password.message = 'Ваши пароли должны совпадать.';
          }else{
            this.validations.confirm_password.valid = true;
            this.validations.confirm_password.message = '';
          }

          return validForm;
        },
      },
    }
</script>

<style scoped>
.user-avatar {
  position: relative;
  width: 245px;
  margin: 0 auto 40px;
  border-radius: 50%;
  overflow: hidden;

}
.user-avatar .overlay-avatar {
  display: none;
  position: absolute;
  align-items: center;
  justify-content: center;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: transparent;
  color: #fff;
  font-size: 30px;
  cursor: pointer;
  transition: all .7s ease;
}

.user-avatar:hover .overlay-avatar{
  display: flex;
  background: rgb(0 0 0 / 36%);
  transition: all .7s ease;
}

.form-group {
  width: 400px;
  margin: 0 auto;
}

.form-group:not(:last-child) {
 margin-bottom: 20px;
}

.form-group input {
  width: 100%;
  padding: 7px;
  margin-top: 5px;
}

.form-group button {
  display: block;
  margin-left: auto;
  padding: 7px;
  cursor: pointer;
}
</style>
