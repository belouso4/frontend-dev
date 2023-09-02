<template>
  <div class="tab-content">

    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Email</h1>
          </div>
          <div class="col-sm-6">
            <AdminUiBreadcrumbs :name="['email']" />
          </div>
        </div>
      </div><!-- /.container-fluid -->
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <div class="row">

          <!-- /.col -->
          <div class="col-md-12">
            <div class="card card-primary card-outline">
              <div class="card-header">
                <h3 class="card-title">Создать новое сообщение</h3>
              </div>
              <!-- /.card-header -->
              <div class="card-body">
                <form-group :validator="$v.form.to">
                  <div class="input-group mb-3 d-flex align-items-center">
                    <div class="input-group-prepend">
                      <button v-click-outside="dropdownClose" @click="dropdown = !dropdown" type="button" class="btn btn-default dropdown-toggle">
                        Написать
                      </button>
                      <div :class="['dropdown-menu', {'show': dropdown}]" style="">
                        <a class="dropdown-item cursor-pointer" @click="form.select = 0">Конкретного человеку</a>
                        <a class="dropdown-item cursor-pointer" @click="form.select = 1">Всем</a>
                        <a class="dropdown-item cursor-pointer" @click="form.select = 3">Одному из базы</a>
                      </div>
                    </div>

                    <input v-if="form.select === 0" v-model="form.to" class="form-control" placeholder="To:">
                    <input v-else-if="form.select === 1" class="form-control" disabled placeholder="To: all">
                    <Options :list.sync="list_emails"
                             :name.sync="form.to"
                             @fetch="searchEmail"
                             :status="!!list_emails.length"
                             v-else>
                      <li v-for="user in list_emails"
                          @click="setEmail(user.email)"
                          :class="['select2-results__option', {'active': form.to === user.email}]">
                        {{ user.email }}
                      </li>
                    </Options>

                  </div>
                </form-group>
                <form-group :validator="$v.form.subject">
                  <input v-model="form.subject" class="form-control" placeholder="Subject:">
                </form-group>
                <form-group :validator="$v.form.message">

                    <client-only>
                      <text-editor v-model="form.message" />
                    </client-only>

                </form-group>
                <form-group :validator="$v.form.attachment">
                  <div class="btn btn-default btn-file">
                    <i class="fas fa-paperclip"></i> Attachment
                    <input @change="onFileChange" type="file" name="attachment" multiple>
                  </div>
                  <p class="help-block">Max. 1MB</p>
                </form-group>
                <ul v-if="form.attachment.length" class="m-0">
                  <li v-for="file in form.attachment">
                    <i class="fas fa-paperclip"></i>
                    {{ file.name }} --- {{ (file.size / 1024 / 1024).toFixed(2) + "MB" }}
                  </li>
                </ul>
              </div>
              <!-- /.card-body -->
              <div class="card-footer">

                <button-loader @fetch="sendMessage" :loading="loading">
                  Отправить
                </button-loader>
              </div>
              <!-- /.card-footer -->
            </div>
            <!-- /.card -->
          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->
      </div><!-- /.container-fluid -->
    </section>
    <!-- /.content -->
  </div>
</template>

<script>
import { required, minLength, maxLength, email, requiredIf} from 'vuelidate/lib/validators'
import TextEditor from "../../../components/admin/mail/TextEditor.vue";

const filSize = (files) => {
  let size = true

  for (var i = 0; i < files.length; i++) {
    if ((files[i].size / 1024 / 1024) > 1) {
      return size = false
    }
  }

  return size
}

export default {
  name: "compose",
  components: {TextEditor},

  layout: 'Admin',
  data() {
    return {
      files: null,
      loading: false,
      dropdown: false,
      debounce: false,
      list_emails: [],
      showOption: false,
      form: {
        to: '',
        select: 3,
        subject: '',
        message: '',
        attachment: '',
        select_email: ''
      }
    }
  },

  validations() {
    return {
      form: {
        to: {
          required: requiredIf(function (nestedModel) {
            return !this.isOptional && +this.form.select === 0
          }),
          minLength: minLength(3),
          maxLength: maxLength(255),
          email
        },
        subject: {
          required,
          maxLength: maxLength(255)
        },
        message: {
          required,
          minLength: minLength(6),
          maxLength: maxLength(50000)
        },
        attachment: {
          filSize
        },
        select_email: {}
      }
    }
  },

  methods: {
    async sendMessage() {
      this.$v.$touch()
      if (this.$v.$invalid) return

      try {
        this.loading = true

        let email = await this.$api.adminMail.send(this.formData(this.form))
        await this.$nuxt.refresh()

        this.$v.$reset()
        this.$toaster.success('Письмо успешно отправлено!')
      } catch (err) {console.log(err)}

      this.loading = false
    },

    formData(data) {
      let formData = new FormData();

      Object.entries(data).forEach(val => {
        if (typeof val[1] === 'object') {
          for (var i = 0; i < val[1].length; i++) {
            formData.append(val[0]+'[]', val[1][i])
          }

        } else {
          formData.append(val[0], val[1])
        }
      })
      return formData
    },

    searchEmail(e) {
      let email = e !== undefined ? e.target.value : null

      if (email && email.length >= 2) {
        clearTimeout(this.debounce);

        this.debounce = setTimeout(async () => {
          try {
            this.list_emails = (await this.$api.adminMail.search(email)).data
          } catch (err) {console.log(err)}
        }, 600)
      } else {this.list_emails = []}
    },

    setEmail(name) {
      this.form.to = name
    },

    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;

      this.form.attachment = files
    },

    dropdownClose(e) {
      let dropdown = this.$el.querySelector('.dropdown-menu')
      if(!dropdown.contains(e.target)) {
        this.dropdown =false
      }
    },
  },
}
</script>

<style scoped>


</style>
