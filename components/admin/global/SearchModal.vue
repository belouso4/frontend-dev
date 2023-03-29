<template>
  <modal :show="$store.getters['ui/getSearchModal']"
         @close-modal="closeModal"
         :size="'margin-lg'"
         :bg="'bg-secondary'">
    <template>
      <div class="modal-body">

        <form @submit.prevent class="w-100 mb-3">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i v-if="!loading" class="fa fa-search"></i>
                <Loader v-else/>
              </span>
            </div>
            <input ref="searchInput" v-model.trim="search" @keyup="searchData()"
                   type="search" class="form-control form-control-lg" placeholder="Введите ключевые слова здесь">
          </div>
        </form>
        <div v-if="search !== '' && Object.keys(data).length">
          <div v-for="(items, key) in data">
            <h5>{{key === 'posts' ? 'Посты' : 'Пользователи'}}</h5>
            <ul class="custom-list">
              <li v-for="item in items" class="d-flex align-items-center" @click="pathPush(key, item.id)">
                <span>
                  <div class="avatar">
                    <img :src="url_img + '/' +item.img" alt="">
                  </div>
                </span>
                  <div v-if="key === 'users'" class="d-flex flex-column">
                    <span>{{item.title}}</span>
                    <span>{{item.email}}</span>
                  </div>
                  <span v-else>{{item.title}}</span>
              </li>
            </ul>
          </div>
        </div>

        <div v-else class="start-screen">{{notResult}}</div>
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from "../global/Modal";
export default {
  name: "UsersListModal",
  components: {Modal},
  data() {
    return {
      url_img: process.env.API_BASE_URL_IMG,
      loading: false,
      search: "",
      debounce: null,
      data: {},
      notResult: 'Нет недавних поисков'
    }
  },

  watch: {
    '$store.state.ui.searchModal': function (value) {
      if (value) {
        var self = this;
        setTimeout(() => {self.$refs.searchInput.focus()},100)
      }
    }
  },

  methods: {
    closeModal() {
      this.$store.commit('ui/setSearchModal', false)
      this.search = ''
      this.data = {}
    },

    pathPush(page, id) {
      let path = '/admin/'+page+'/'+id;

      this.$router.push({path: path})
      this.closeModal()
    },

    searchData() {
        if (this.search && this.search.length >= 2) {
          this.loading = true
          clearTimeout(this.debounce);

          this.debounce = setTimeout(() => {
            if(!this.search) {
              this.loading = false
              return false
            }
            this.$api.adminGeneral.search({search: this.search}).then(response => {
              if (!Object.keys(response).length) this.notResult = 'Нет результатов для "'+this.search+'"'
              console.log(response)
              this.data = response ?? {}
            }).catch(() => {
              console.warn('Oh. Something went wrong')
            }).finally(() => {
              this.loading = false
            });
          }, 400);
        } else {
          this.notResult = 'Нет недавних поисков'
          this.data = {}
        }
    },

  },
}
</script>

<style scoped>
  .limit-height {
    /*max-height: 500px;*/
    /*height: 100%;*/
    height: 400px;
  }

  .input-group-text {
    padding: 0 18px;
  }

  .custom-list {

  }
  .custom-list li {
    margin: 7px 0;
    cursor: pointer;
    color: #fff;
    border: 1px solid transparent;
    padding: 10px;
    border-radius: 0.25rem;
    background: rgb(255 255 255 / 17%);
    width: 100%;
  }

  .custom-list li:hover {
    background: rgb(255 255 255 / 25%);
  }

  .custom-list li > span:not(:last-child) {
    margin-right: 10px;
  }

  .custom-list .avatar {
    border: 1px solid #cecece;
    border-radius: 50%;
    overflow: hidden;
    width: 40px;
    height: 40px;
    background: #fff;
  }
  .custom-list .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  [type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
    height: 10px;
    width: 10px;
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjEyMy4wNXB4IiBoZWlnaHQ9IjEyMy4wNXB4IiB2aWV3Qm94PSIwIDAgMTIzLjA1IDEyMy4wNSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTIzLjA1IDEyMy4wNTsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTEyMS4zMjUsMTAuOTI1bC04LjUtOC4zOTljLTIuMy0yLjMtNi4xLTIuMy04LjUsMGwtNDIuNCw0Mi4zOTlMMTguNzI2LDEuNzI2Yy0yLjMwMS0yLjMwMS02LjEwMS0yLjMwMS04LjUsMGwtOC41LDguNQ0KCQljLTIuMzAxLDIuMy0yLjMwMSw2LjEsMCw4LjVsNDMuMSw0My4xbC00Mi4zLDQyLjVjLTIuMywyLjMtMi4zLDYuMSwwLDguNWw4LjUsOC41YzIuMywyLjMsNi4xLDIuMyw4LjUsMGw0Mi4zOTktNDIuNGw0Mi40LDQyLjQNCgkJYzIuMywyLjMsNi4xLDIuMyw4LjUsMGw4LjUtOC41YzIuMy0yLjMsMi4zLTYuMSwwLTguNWwtNDIuNS00Mi40bDQyLjQtNDIuMzk5QzEyMy42MjUsMTcuMTI1LDEyMy42MjUsMTMuMzI1LDEyMS4zMjUsMTAuOTI1eiIvPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=);
    background-size: 10px 10px;
  }

  .start-screen {
    margin: 0 auto;
    padding: 36px 0;
    text-align: center;
  }

  .input-group-prepend img {
    width: 16px;
  }
</style>

