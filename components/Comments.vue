<template>
  <div class="comments">
    <div class="comments-header">
      <h2>Комментарии</h2>
      <p @click="showComments = !showComments">

        <i class="fa-solid fa-comment"></i>
        <span>{{ comments.comments_count }}</span>
      </p>
    </div>
    <div v-if="showComments" class="comments-body">
      <div v-for="comment in comments.comments" class="comment">
        <div class="main-comment">
          <div class="avatar">
            <img :src="comment.user.avatar" alt="">
          </div>
          <div class="comment-header">
            {{ comment.user.name }} • {{ comment.created_at }}
          </div>
          <p class="comment-body">
            {{ comment.body }}
          </p>
          <div class="comment-elem">
            <p v-if="comment.replies.length" @click="repliesSetShow(comment.id)">
              <span>{{ comment.replies.length }}</span>
              <i class="fa-solid fa-comment"></i>
            </p>
            <p @click="setReplyingTo(comment)">
              <i class="fa-solid fa-reply"></i>
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
      <template v-if="comments.comments_count !== comments.comments.length">
        <div v-if="!loadComments && comments.comments.length"
             @click="fetchComments(comments.comments.length); loadComments = true"
             class="comment-load">
          Подгрузить комментарии ({{ comments.comments_count - comments.comments.length }})
        </div>
        <div v-else class="loading-comment">Loading...</div>
      </template>
    </div>

    <form v-if="showComments" class="add-comment" @submit.prevent="sendCommet()">
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
  props: {
    comments: {
      type: Object,
      defaults: {}
    }
  },

  data: () => ({
    body: '',
    showComments: false,
    replyingTo: {},
    repliesShow: [],
    loadComments: false
  }),

  methods: {
    async sendCommet() {
      if (!this.$auth.loggedIn) this.$router.push({path: '/login'})
      if (this.body != '') {

        const comment = await this.$api.comments.addComment(
          this.$route.params.slug, {
          body: this.body,
          parent_id: this.replyingTo.id ? this.replyingTo.id : null
        })
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

        this.clearReplyingTo()
        this.body = ''
      }
    },
    async fetchComments(offset = 0) {
      if (this.comments.comments_count !== this.comments.comments.length) {
        let comments = await this.$api.comments.index(this.$route.params.slug, offset)
        comments.comments.length ? this.comments.comments.push(...comments.comments) : false
        this.comments.comments_count = comments.comments_count
        this.loadComments = false

      }
      this.loadComments = false
    },
    setReplyingTo(comment) {
      this.replyingTo = comment
    },
    clearReplyingTo() {
      this.replyingTo = {}
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
      this.$api.comments.likeComment(comment.id).then(res => console.log(res))
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
.comments {
  margin-top: 30px;
}

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
  bottom: -27px;
  font-size: 18px;
  display: flex;
}

.comment-elem p {
  position: relative;
  cursor: pointer;
}

.comment-elem p span {
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 12px;
  color: #fff;
  line-height: 23px;
  display: block;
  width: 100%;
  text-align: center;
}

.comment-elem p:not(:last-child) {
  margin-right: 10px;
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
  display: inline-block;
  text-align: center;
  cursor: pointer;
}

.close-replying i {
  line-height: 16px;
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
</style>
