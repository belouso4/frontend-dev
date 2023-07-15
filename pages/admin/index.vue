<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Dashboard</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <AdminUiBreadcrumbs/>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div>
    </section>
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-3 col-6">
            <!-- small box -->
            <div class="small-box bg-info">
              <div v-if="!published" class="overlay dark spinner-load">
                <!--                <i class="fas fa-3x fa-sync-alt"></i>-->
                <Loader/>
              </div>
              <div class="inner">
                <h3 v-if="published">{{ published }}</h3>
                <h3 v-else>0000</h3>

                <p>Опубликованно записей</p>
              </div>
              <div class="icon">
                <i class="ion fa-solid fa-users"></i>
              </div>
              <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <!-- ./col -->
          <div class="col-lg-3 col-6">
            <!-- small box -->
            <div class="small-box bg-success">
              <div v-if="!comments" class="overlay dark spinner-load">
<!--                <i class="fas fa-3x fa-sync-alt"></i>-->
                <Loader/>
              </div>
              <div class="inner">
                <h3 v-if="comments">{{ comments }}</h3>
                <h3 v-else>0000</h3>

                <p>Всего комментариев</p>
              </div>
              <div class="icon">
                <i class="ion ion-stats-bars"></i>
              </div>
              <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <!-- ./col -->
          <div class="col-lg-3 col-6">
            <!-- small box -->
            <div class="small-box bg-warning">
              <div v-if="!users" class="overlay dark spinner-load">
                <!--                <i class="fas fa-3x fa-sync-alt"></i>-->
                <Loader/>
              </div>
              <div class="inner">
                <h3 v-if="users">{{ users }}</h3>
                <h3 v-else>0000</h3>

                <p>Зарегистрированно пользователей</p>
              </div>
              <div class="icon">
                <i class="ion ion-person-add"></i>
              </div>
              <a href="#" class="small-box-footer">Список пользователей <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <!-- ./col -->
          <div class="col-lg-3 col-6">
            <!-- small box -->
            <div class="small-box bg-danger">
              <div v-if="!viewed" class="overlay dark spinner-load">
                <!--                <i class="fas fa-3x fa-sync-alt"></i>-->
                <Loader/>
              </div>
              <div class="inner">
                <h3 v-if="viewed">{{ viewed }}</h3>
                <h3 v-else>0000</h3>

                <p>Просмотренно публикаций</p>
              </div>
              <div class="icon">
                <i class="ion ion-pie-graph"></i>
              </div>
              <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <!-- ./col -->
        </div>
        <div class="row">
          <div class="col-lg-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title" @click="$fetch">Топ самых просматриваемых публикаций</h3>
                
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-head-fixed text-nowrap">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>title</th>
                    <th>Date</th>
                    <th>Просмотры</th>
                  </tr>
                  </thead>
                  <tbody>

                  <template v-if="postViewed.length">
                    <tr v-for="item in postViewed">
                      <td>{{ item.id }}</td>
                      <td>{{ item.title }}</td>
                      <td>{{ item.created_at }}</td>
                      <td>{{ item.post_view_count }}</td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr v-for="item in 5">
                      <td class="skeleton-table-item"><span class="skeleton"></span></td>
                      <td class="skeleton-table-item"><span class="skeleton"></span></td>
                      <td class="skeleton-table-item"><span class="skeleton"></span></td>
                      <td class="skeleton-table-item"><span class="skeleton"></span></td>
                    </tr>
                  </template>
                  </tbody>
                </table>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>
          <div class="col-lg-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Fixed Header Table</h3>
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-head-fixed text-nowrap">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>title</th>
                    <th>Date</th>
                    <th>Лайки</th>
                  </tr>
                  </thead>
                  <tbody>
                  <template v-if="postLikes.length">
                    <tr v-for="item in postLikes">
                      <td>{{ item.id }}</td>
                      <td>{{ item.title }}</td>
                      <td>{{ item.created_at }}</td>
                      <td>{{ item.likes_count }}</td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr v-for="item in 5">
                      <td class="skeleton-table-item"><span class="skeleton"></span></td>
                      <td class="skeleton-table-item"><span class="skeleton"></span></td>
                      <td class="skeleton-table-item"><span class="skeleton"></span></td>
                      <td class="skeleton-table-item"><span class="skeleton"></span></td>
                    </tr>
                  </template>
                  </tbody>
                </table>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>
        </div>
      </div>

    </section>

  </div>
</template>

<script>

export default {
  name: "admin",
  layout: 'Admin',
  data() {
    return {
      published: '',
      comments: '',
      users: '',
      viewed: '',
      postViewed: [],
      postLikes: [],
    }
  },

  async fetch() {
    this.published = await this.$api.adminMain.characteristics('published')
    this.comments = await this.$api.adminMain.characteristics('comments')
    this.users = await this.$api.adminMain.characteristics('users')
    this.viewed = await this.$api.adminMain.characteristics('viewed')

    this.postViewed = await this.$api.adminMain.postRating('viewed')
    this.postLikes = await this.$api.adminMain.postRating('likes')
  }
}
</script>

<style scoped>
.skeleton {
  animation: skeleton-loading 1s linear infinite alternate;
}


@keyframes skeleton-loading {
  0% {
    background-color: #c2cfd6;
  }
  100% {
    background-color: #f0f3f5;
  }
}
 .skeleton-characteristics {
   width: 30%;
   display: block;
   height: calc(2.2rem + 7px);
   background: #cecece;
   border-radius: 7px;
 }
 .skeleton-table-item span {
   width: 40px;
   display: inline-block;
   height: 17px;
   background: #cecece;
   border-radius: 7px;
 }
 /*.skeleton-table tbody td:nth-child(4) span {*/
 /*  width: 130px;*/
 /*  display: block;*/
 /*  height: 49px;*/
 /*  background: #cecece;*/
 /*  border-radius: 7px;*/
 /*}*/
.skeleton-table-item:nth-child(2) span {
   width: 200px;
 }
.skeleton-table-item:nth-child(3) span {
   width: 90px;
 }
</style>
