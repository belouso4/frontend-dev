import PostsAPI from "../api/posts.js";
import CommentsAPI from "../api/comments.js";
import UserAPI from "../api/user.js";
import CategoryAPI from "../api/categories.js";
import OtherAPI from "../api/other.js";
import AccountAPI from "../api/account.js";
import TagAPI from "../api/tags.js";

import AdminTagsAPI from "../api/admin/tags.js";
import AdminPostsAPI from "../api/admin/posts.js";
import AdminPostCommentsAPI from "../api/admin/comments.js";
import AdminUsersAPI from "../api/admin/users.js";
import AdminRolesAPI from "../api/admin/roles.js";
import AdminUsersRolesAPI from "../api/admin/users-roles.js";
import AdminGeneralAPI from "../api/admin/general.js";
import AdminMailAPI from "../api/admin/mail.js";
import AdminCategoriesAPI from "../api/admin/categories.js";
import AdminOtherAPI from "../api/admin/other.js";
import AdminMainAPI from "../api/admin/main.js";

export default function( { $axios }, inject ){

  const api = {
    // api client
    posts: PostsAPI( $axios ),
    comments: CommentsAPI( $axios ),
    user: UserAPI( $axios ),
    category: CategoryAPI($axios),
    other: OtherAPI($axios),
    account: AccountAPI($axios),
    tag: TagAPI($axios),

    // api admin
    adminTags: AdminTagsAPI( $axios ),
    adminPosts: AdminPostsAPI( $axios ),
    adminPostComments: AdminPostCommentsAPI( $axios ),
    adminUsers: AdminUsersAPI( $axios ),
    adminRoles: AdminRolesAPI( $axios ),
    adminUsersRoles: AdminUsersRolesAPI( $axios ),
    adminGeneral: AdminGeneralAPI( $axios ),
    adminMail: AdminMailAPI( $axios ),
    adminCategories: AdminCategoriesAPI( $axios ),
    adminOther: AdminOtherAPI( $axios ),
    adminMain: AdminMainAPI( $axios ),
  }

  inject('api', api);
}
