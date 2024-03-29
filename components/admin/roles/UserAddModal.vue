<template>
  <modal :show.sync="show" @close-modal="closeModal" :size="'modal-lg'">
    <template>
      <div v-if="loading" class="overlay">
        <i class="fas fa-2x fa-sync fa-spin"></i>
      </div>
      <div class="modal-header">
        <h4 class="modal-title">Создание пользователя</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span @click="closeModal" aria-hidden="true">×</span>
        </button>
      </div>
      <div class="modal-body">

        <div class="row">
          <div class="col-12 d-flex align-items-stretch flex-column">
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
                         class="img-circle avatar img-circle-size">
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
          <div class="col-md-12 d-flex">
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
        </div>

      </div>
      <div class="modal-footer justify-content-between">
        <button @click="closeModal()" class="btn btn-outline-light">Отмена</button>
        <button @click="createUser()" class="btn btn-outline-dark">
          <span>Создать</span>
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from "../global/Modal";
import { required, minLength, maxLength, helpers, email, sameAs} from 'vuelidate/lib/validators'

let allowedExtension = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

const fileImg = (value) => !helpers.req(value) || allowedExtension.indexOf(value.type) > -1
const filSize = (value) => !helpers.req(value) || (value.size / 1024 / 1024) < 1

export default {
  name: "UserAddModal",
  components: {Modal},
  props: {
    show: Boolean
  },
  data() {
    return {
      imgShow: process.env.API_BASE_URL_IMG + '/avatar.png',
      form: {
        name: '',
        email: '',
        avatar: '',
        password: '',
        added: true
      },
      loading: false,
      formCopy: {}
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

  mounted() {
    this.formCopy = { ...this.form };
  },

  methods: {
     createUser() {
       this.$v.$touch()
       if (this.$v.$invalid) return

       this.$emit('create-user', this.form)
       this.$v.$reset()
       this.$toaster.info('Данные сохраннены локально!')
       this.closeModal()
    },

    closeModal() {
      this.$emit("update:show", false);
      this.clearForm()
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

    clearForm() {
      this.form = { ...this.formCopy };
      this.imgShow = process.env.API_BASE_URL_IMG + '/avatar.png'
    }
  },
}
</script>

<style>
.modal-footer button {
  min-width: 140px;
  height: 38px;
}

.modal-footer .spinner-button {
  width: 100%;
  height: 100%;
}

.modal-footer .spinner-button img{
  width: auto;
  height: 100%;
  margin: 0 auto;
}
</style>
