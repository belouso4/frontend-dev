<template>
  <div class="comments">
    <div class="comments-header">
      <h2 class="mb-4 mt-3">Комментарии</h2>
      <p>
        <i class="fa-solid fa-comment"></i>
        <span>{{ comments.comments_count }}</span>
      </p>
    </div>
    <div class="comments-body">
      <div v-for="comment in comments.comments" class="comment">
        <div class="main-comment">
          <div class="avatar">
            <img :src="comment.user.avatar" alt="">
          </div>
          <div class="comment-header">
            {{ comment.user.name }} • {{ comment.created_at }}
            <span @click="deleteComment(comment.id)"><i class="fas fa-trash"></i></span>
          </div>
          <p class="comment-body">
            {{ comment.body }}
          </p>
          <div class="comment-elem">
            <p @click="setReplyingTo(comment)">
              <i class="fa-solid fa-reply"></i>
            </p>
            <p v-if="comment.replies?.length" @click="repliesSetShow(comment.id)">
              <i class="fa-solid fa-comment"></i>
              <span>{{ comment.replies?.length }}</span>
            </p>
            <p @click.prevent="like(comment)" :class="[{ active: comment.user_like_count }, 'like']">
              <i class="far fa-heart"></i>
              {{comment.likes_count}}
            </p>
          </div>
        </div>
        <div class="comments-replying">
          <div v-if="repliesShow.length > 0 && repliesShow.indexOf(comment.id) !== -1"
               v-for="reply in comment.replies" class="comment">
            <div class="avatar">
              <img :src="comment.user.avatar" alt="">
            </div>
            <div class="comment-header">
              {{ reply.user.name }} • {{ reply.created_at }}
              <span @click="deleteComment(reply.id)"><i class="fas fa-trash"></i></span>
              <!--              Sebastian hilton • Feb 26-->
            </div>
            <p class="comment-body">
              {{ reply.body }}
            </p>
            <div class="comment-elem">
              <p @click="setReplyingTo(comment)">
                <i class="fa-solid fa-reply"></i>
              </p>
              <p @click.prevent="like(reply)" :class="[{ active: reply.user_like_count }, 'like']">
                <i class="far fa-heart"></i>
                {{reply.likes_count}}
              </p>
            </div>
          </div>
        </div>
      </div>
      <template v-if="comments.comments_count !== comments.comments?.length">
        <div v-if="!loading && comments.comments_count"
             @click="loadComments(comments.comments.length)"
             class="comment-load">
          Подгрузить комментарии ({{ comments.comments_count - comments.comments.length }})
        </div>
        <div v-else class="loading-comment">Loading...</div>
      </template>
    </div>

    <form class="add-comment" @submit.prevent="sendComment($event)">
      <p v-if="replyingTo.id">
        <span class="close-replying" @click="clearReplyingTo()">
          <i class="fa-solid fa-xmark"></i>
        </span>
        Ответить: {{ replyingTo.user.name }} | {{ replyingTo.body }}
      </p>
      <div class="add-comment_wrap">
        <textarea @focus="!$auth.loggedIn ? $router.push({path: '/login'}) : true" v-model="body" name="" placeholder="Добавить комментарий" id="" cols="30" rows="10"></textarea>
        <button>Отправить</button>
      </div>
    </form>

  </div>
</template>

<script>

export default {
  name: "Comments",
  props: ['comments'],

  data: () => ({
    // BASE_URL: process.env.API_BASE_URL + '/storage/',
    body: '',
    // showComments: false,
    replyingTo: {},
    repliesShow: [],
    loading: false,

  }),

  methods: {
    async sendComment(e) {
      if (this.body != '') {
        e.target.querySelector('textarea').setAttribute('disabled', '')
        const data = {
          body: this.body,
          parent_id: this.replyingTo.id
        }
        console.log(data)
        const comment = await this.$api.adminPostComments.addComment(this.$route.params.slug, data)
        console.log(comment)
        this.body = ''
        this.clearReplyingTo()
        e.target.querySelector('textarea').removeAttribute('disabled')

        if (!comment.parent_id) {
          this.comments.comments_count++

          if(this.comments.comments.length < 4 || this.comments.comments_count === this.comments.comments.length) {
            comment.replies = []
            this.comments.comments.push(comment)
          }
        } else {
          this.comments.comments.find(x => x.id === comment.parent_id)
            .replies.push(comment)
        }
      }
    },
    async loadComments(offset) {
      this.loading = true
      if (this.comments.comments_count !== this.comments.comments.length) {
        let comments = await this.fetchComments(offset)
        comments.comments.length ? this.comments.comments.push(...comments.comments) : false
        this.comments.comments_count = comments.comments_count
      }
      this.loading = false
    },
    async fetchComments(offset = 0) {
      return await this.$api.adminPostComments.getComments(this.$route.params.slug, offset)
    },
    setReplyingTo(comment) {
      this.replyingTo = comment
    },

    clearReplyingTo() {
      this.replyingTo = {}
    },

     async deleteComment(id) {
      this.$emit('update:loading-comments', true)

     const [comment, comments] = await Promise.all([
       this.$api.adminPostComments.deleteComment(id),
       this.fetchComments()
     ])

       this.$emit('update:comments', comments)
       this.$emit('update:loading-comments', false)
    },

    clearComment(comment) {
      let comments = this.comments.comments
      this.comments.comments_count--
      if (!comment.parent_id) {
        comments.splice(comments.findIndex(object => object.id === comment.id), 1)
      } else {
        let replies = comments.find(x => x.id === comment.parent_id).replies
        comments.find(x => x.id === comment.parent_id)
          .replies.splice(replies.findIndex(object => object.id === comment.id), 1)
      }
    },

    repliesSetShow(id) {
      var myIndex = this.repliesShow.indexOf(id);
      if (myIndex !== -1) {
        this.repliesShow.splice(myIndex, 1);
        return
      }
      this.repliesShow.push(id)
    },

    like(comment) {
      this.$api.adminPostComments.likeComment(comment.id).then(res => console.log(res))
      if(!comment.parent_id) {
        this.comments.comments.filter(a => {
          if(a.id === comment.id) {
            if (comment.user_like_count === 0) {
              a.user_like_count = 1
              a.likes_count++
            } else {
              a.user_like_count = 0
              a.likes_count--
            }
          }
        })
      } else {
        this.comments.comments.find(x => x.id === comment.parent_id)
          .replies.filter(a => {
          if(a.id === comment.id) {
            if (comment.user_like_count === 0) {
              a.user_like_count = 1
              a.likes_count++
            } else {
              a.user_like_count = 0
              a.likes_count--
            }
          }
        })
      }
    },
  },
}
</script>

<style scoped>

.comments-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.comments-body {
  margin-top: 10px;
  padding-left: 48px;
}

.comment .main-comment, .comment .comments-replying .comment {
  position: relative;
  border: 1px solid #cecece;
  border-radius: 15px;
  padding: 17px;
  background: #fff;
}

.comment-header {
  margin-bottom: 10px;
}

.comment .comment-body {
  line-height: 23px;
}

.comment .avatar, .add-comment .avatar {
  position: absolute;
  border: 1px solid #cecece;
  border-radius: 50%;
  left: -48px;
  top: 11px;
  overflow: hidden;
  width: 40px;
  height: 40px;

}

.comment-elem {
  position: absolute;
  right: 12px;
  bottom: -30px;
  font-size: 18px;
  display: flex;
}

.comment-elem p {
  position: relative;
  cursor: pointer;
  margin: 0;
}

.comment-elem p:not(:last-child) {
  margin-right: 15px;
}

.comments-body .comment {
  margin-bottom: 40px;
}

/*.comments-body .comment:not(:last-child) {*/
/*  margin-bottom: 40px;*/
/*}*/

.comment .comments-replying {
  margin-left: 43px;
}

.comment .comments-replying .comment {
  margin-top: 40px;
}

.add-comment_wrap {
  position: relative;
  margin-top: 10px;
}

.add-comment button {
  position: absolute;
  right: 10px;
  bottom: 14px;
  font-size: 12px;
  color: #000;
  line-height: 23px;
  display: block;
  text-align: center;
  margin-left: auto;
  cursor: pointer;
}

.add-comment > p {
  display: flex;
  align-items: center;
}

.add-comment textarea{
  position: relative;
  border: 1px solid #cecece;
  border-radius: 15px;
  padding: 17px;
  width: 100%;
}

.close-replying {
  border: 1px solid black;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  margin-right: 5px;
}

.comments-header p {
  cursor: pointer;
  margin: 0;
}

.comments .like.active {
  color: #d20909;
}

.comment-load {
  margin: 20px auto;
  width: fit-content;
  border-bottom: 2px dotted transparent;
  cursor: pointer;
}

.comment-load:hover {
  border-bottom: 2px dotted #cecece;
}

.loading-comment {
  margin: 20px auto;
  width: fit-content;
}

.avatar img {
  width: 100%;
}

.comment-header > span {
  cursor: pointer;
  margin-left: 5px;
  transition: opacity .15s ease;
}

.comment-header > span:hover {
  opacity: 0.7;
}



</style>

