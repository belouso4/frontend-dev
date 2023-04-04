<template>
  <div class="tab-content">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Compose</h1>
          </div>
          <div class="col-sm-6">
            <AdminUiBreadcrumbs :name="['написать']" />
          </div>
        </div>
      </div><!-- /.container-fluid -->
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-3">
            <a href="mailbox.html" class="btn btn-primary btn-block mb-3">Back to Inbox</a>

            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Folders</h3>

                <div class="card-tools">
                  <button type="button" class="btn btn-tool" data-card-widget="collapse">
                    <i class="fas fa-minus"></i>
                  </button>
                </div>
              </div>
              <div class="card-body p-0">
                <ul class="nav nav-pills flex-column">
                  <li class="nav-item active">
                    <a href="#" class="nav-link">
                      <i class="fas fa-inbox"></i> Inbox
                      <span class="badge bg-primary float-right">12</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="#" class="nav-link">
                      <i class="far fa-envelope"></i> Sent
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="#" class="nav-link">
                      <i class="far fa-file-alt"></i> Drafts
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="#" class="nav-link">
                      <i class="fas fa-filter"></i> Junk
                      <span class="badge bg-warning float-right">65</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="#" class="nav-link">
                      <i class="far fa-trash-alt"></i> Trash
                    </a>
                  </li>
                </ul>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Labels</h3>

                <div class="card-tools">
                  <button type="button" class="btn btn-tool" data-card-widget="collapse">
                    <i class="fas fa-minus"></i>
                  </button>
                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body p-0">
                <ul class="nav nav-pills flex-column">
                  <li class="nav-item">
                    <a class="nav-link" href="#"><i class="far fa-circle text-danger"></i> Important</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#"><i class="far fa-circle text-warning"></i> Promotions</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#"><i class="far fa-circle text-primary"></i> Social</a>
                  </li>
                </ul>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>
          <!-- /.col -->
          <div class="col-md-9">
            <div class="card card-primary card-outline">
              <div class="card-header">
                <h3 class="card-title">Compose New Message</h3>
              </div>
              <!-- /.card-header -->
              <div class="card-body">
                <form-group :validator="$v.form.to">
                  <input v-model="form.to" class="form-control" placeholder="To:">
                </form-group>
                <form-group :validator="$v.form.subject">
                  <input v-model="form.subject" class="form-control" placeholder="Subject:">
                </form-group>
                <form-group :validator="$v.form.message">
                  <text-editor v-model="form.message" />
<!--                    <textarea  id="compose-textarea" class="form-control" style="height: 300px">-->

<!--                    </textarea>-->

                </form-group>
                <form-group :validator="$v.form.attachment">
                  <div class="btn btn-default btn-file">
                    <i class="fas fa-paperclip"></i> Attachment
                    <input @change="onFileChange" type="file" name="attachment" multiple>
                  </div>
<!--                  <p class="help-block">Max. 32MB</p>-->
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
                <div class="float-right">
                  <button type="button" class="btn btn-default"><i class="fas fa-pencil-alt"></i> Draft</button>
                  <button @click="sendMessage()" type="submit" :disabled="loading" class="btn btn-primary btn-with-loader">
                    <i class="far fa-envelope"></i>
                    <span v-if="!loading">Отправить</span>
                    <Loader width="20px" v-else/>
                  </button>
                </div>
                <button type="reset" class="btn btn-default"><i class="fas fa-times"></i> Discard</button>
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
import { required, minLength, maxLength, helpers, email} from 'vuelidate/lib/validators'
import textEditor from "../../../components/admin/mail/TextEditor";

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
  components: {textEditor},

  layout: 'Admin',
  data() {
    return {
      files: null,
      loading: false,
      form: {
        to: 'kirill.bielousov15151515@gmail.com',
        subject: 'Slack уходит из РФ. Чем заменить?',
        message: 'ergegerg',
        attachment: '',
      }
    }
  },

  validations() {
    return {
      form: {
        to: {
          required,
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
          // maxLength: maxLength(5000)
        },
        attachment: {
          filSize
        },
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
        console.log(email)
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

    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      console.log(files)
      // if (this.$v.form.avatar.$invalid)
      //   return;

      if (!files.length)
        return;

      // let reader = new FileReader();
      // let vm = this;
      // reader.onload = (e) => {
      //   vm.files = e.target.result;
      // };
      //
      // reader.readAsDataURL(files[0]);
      this.form.attachment = files
    },
  }
}
</script>

<style scoped>

</style>
