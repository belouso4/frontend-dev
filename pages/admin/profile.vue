<template>
  <div class="tab-content">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Профиль</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">User Profile</li>
            </ol>
          </div>
        </div>
      </div><!-- /.container-fluid -->
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-3">

            <!-- Profile Image -->
            <div class="card card-primary card-outline">
              <div class="card-body box-profile">
                <div class="text-center">
                  <img style="width: 140px;height: 140px;object-fit: cover;" class="profile-user-img img-fluid img-circle"
                       :src="imgShow ?? $auth.user.avatar"
                       alt="User profile picture">
                </div>

                <h3 class="profile-username text-center">{{ $auth.user.name }}</h3>

                <p class="text-muted text-center">{{ $auth.user.email }}</p>

                <div class="custom-file">
                  <input @change="onFileChange" type="file" placeholder="Довавьте изображение" id="customFile" class="custom-file-input">
                  <label for="customFile" class="custom-file-label">Добавьте изображение...</label>
                </div>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
            <!-- /.card -->
          </div>
          <!-- /.col -->
          <div class="col-md-9">
            <div class="card">
              <div class="card-header p-2">
                <h4>Личные данные</h4>
              </div><!-- /.card-header -->
              <div class="card-body">


                  <!-- /.tab-pane -->

                  <div class="tab-pane active" id="settings">
                    <form class="form-horizontal" @submit.prevent="sendBtn()">
                      <div class="form-group row">
                        <label for="inputName" class="col-sm-2 col-form-label">Имя/Фамилия</label>
                        <div class="col-sm-10">
                          <input type="text" class="form-control" v-model="form.name" id="inputName" placeholder="Имя/Фамилия">
                        </div>
                      </div>
                      <div class="form-group row">
                        <label for="inputSkills" class="col-sm-2 col-form-label">Email</label>
                        <div class="col-sm-10">
                          <input type="email" class="form-control" v-model="form.email" id="inputSkills" placeholder="Email">
                        </div>
                      </div>
                      <div class="form-group row">
                        <label for="inputEmail" class="col-sm-2 col-form-label">Старый пароль</label>
                        <div class="col-sm-10">
                          <input type="password" v-model="form.old_password" class="form-control" id="inputEmail" placeholder="Старый пароль">
                        </div>
                      </div>
                      <div class="form-group row">
                        <label for="inputName2" class="col-sm-2 col-form-label">Новый пароль</label>
                        <div class="col-sm-10">
                          <input type="password" v-model="form.new_password" class="form-control" id="inputName2" placeholder="Новый пароль">
                        </div>
                      </div>
                      <div class="form-group row">
                        <label for="inputName3" class="col-sm-2 col-form-label">Повторите новый пароль</label>
                        <div class="col-sm-10">
                          <input type="password" v-model="form.confirm_password" class="form-control" id="inputName3" placeholder="Повторите новый пароль">
                        </div>
                      </div>
                      <div class="form-group row">
                        <div class="offset-sm-2 col-sm-10 d-flex justify-content-end">
                          <button type="submit" class="btn btn-primary">Сохранить</button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <!-- /.tab-pane -->

              </div><!-- /.card-body -->
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
  <!-- /.content-wrapper -->
</template>

<script>
export default {
  name: "profile",
  layout: 'Admin',
  data() {
    return {
      imgShow: null,
      form: {
        email: this.$auth.user.email,
        name: this.$auth.user.name
      }
    }
  },
  methods: {
    async sendBtn() {
      console.log(this.form)
      await this.$api.adminGeneral.profile(this.formData(this.form)).then(res => {
        console.log(res)
        this.$auth.fetchUser();
      })
    },

    formData(data) {
      let formData = new FormData();

      Object.entries(data).forEach(val => {
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
  }
}
</script>

<style scoped>

</style>
