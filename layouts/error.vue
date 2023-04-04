<template>

  <div v-if="$route.path.indexOf('/admin') > -1" class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">{{error.statusCode}} Страница ошибки</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item active"><i class="fa-solid fa-house"></i></li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div>
    </section>
    <section class="content page-error" style="margin-top: 150px">
      <div class="container-fluid " style="text-align: center;">
        <h2 :class="[error.statusCode === 404 ? 'text-warning' : 'text-danger']">{{error.statusCode}}</h2>
<!--        {{ error.statusCode === 404 ? 'Такой страницы не существует' : error.message }}-->
        <div class="error-content">
          <h3 v-if="error.statusCode === 404"><i class="fas fa-exclamation-triangle text-warning"></i> Упсс! Страница не найдена.</h3>
          <h3 v-else><i class="fas fa-exclamation-triangle text-danger"></i> Ой! Что-то пошло не так.</h3>

          <p v-if="error.statusCode === 404">
            Мы не смогли найти страницу, которую вы искали.
            Тем временем вы можете <nuxt-link to="/admin">вернуться в панель управления</nuxt-link>
          </p>
          <p v-else>
            Мы будем работать над исправлением этого прямо сейчас.
            Тем временем вы можете <nuxt-link to="/admin">вернуться в панель управления</nuxt-link>
          </p>
        </div>
      </div>
    </section>
  </div>
  <section v-else>
    <div class="container">
      <p style="font-size: 50px">{{ error.statusCode }}</p>
      {{ error.message }}
    </div>
  </section>
</template>
<script>
    export default {
      name: "error",
      // layout: 'App',
      props: ['error'],
      layout: (context) => context.route.path.indexOf('/admin') > -1 ? 'Admin' : 'AppMain',
      created() {
console.log(this.$route.path.indexOf('/admin') > -1)
      }

    }
</script>

<style scoped>

.page-error h2 {
  margin-right: 10px;
  font-size: 100px;
}

.page-error > div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-error .error-content {
  width: 436px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}


</style>
