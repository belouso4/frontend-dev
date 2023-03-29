<template>
  <div class="permissions">
    <h4>Разрешения <strong>сохраняются автоматически</strong></h4>
    <div class="permissions-table">
      <div class="permissions-table_header">
        <span class="name">Коллекция</span>
        <span class="v-icon elem-permission">
          <i class="fa-solid fa-plus"></i>
        </span>
        <span class="v-icon elem-permission">
          <i class="fa-solid fa-eye"></i>
        </span>
        <span class="v-icon elem-permission">
          <i class="fa-solid fa-pen"></i>
        </span>
        <span class="v-icon elem-permission">
          <i class="fa-solid fa-trash"></i>
        </span>
      </div>
      <button class="btn-all-collection">
        Коллекции <i class="fa-solid fa-angle-up"></i>
      </button>

      <div class="permissions-table_body">
        <div v-for="permission in permissions" class="permissions-table_body__row">
          <span class="name">{{permission.group_name}}</span>
          <span v-for="(value, key) in permission.actions"
                @click="updatePermission(key, permission.group_slug)"
                :class="[{'disabled': $route.params.id == 1 && ((13 <= key) && (key <= 16))},'v-icon elem-permission']">

            <img v-if="key === currentLoad" src="/loader.gif" alt="">
            <i v-else-if="examination(value, permission.group_slug)" class="fa-solid fa-check"></i>
            <i v-else class="fa-solid fa-ban"></i>
          </span>
        </div>
      </div>

      <div class="permissions-table_footer">
        Сбросьте системные разрешения на:
        <span @click="setMinimumPermissions()">Минимальный доступ к приложению</span> / <span @click="setDefaultPermissions()">Рекомендуемые значения по умолчанию</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PermissionTable",
  loading: false,
  props: {
    permissions: Object,
    role_permissions: Object,
    show: Boolean
  },
  data() {
    return {
      currentLoad: null,
    }
  },
  watch: {
    role_permissions:  {
      handler: function (after, before) {
      },
      deep: true
    },
  },
  methods: {
    async updatePermission(id, slug) {
      //it is forbidden to change the role with id 1 and permissions under id c 13-16
      if(this.$route.params.id == 1 && (13 <= id) && (id <= 16)) return
      this.currentLoad = id

      await this.$api.adminRoles.permissionUpdate(this.$route.params.id, {id, slug})
        .then(res => {
          let permissions = this.role_permissions[res.group_slug]
          let index = permissions.actions.findIndex(object => object === res.name)

          if(index >= 0) {
            permissions.actions.splice(index, 1)
          } else {
            permissions.actions.push(res.name)
          }

          this.currentLoad = null
        })
    },

    examination(permission , slug) {
      return this.role_permissions[slug] ?
        this.role_permissions[slug].actions.includes(permission)
        : false
    },

    setDefaultPermissions() {
      if (this.$route.params.id == 1) return this.$toaster.warning('Изменять разрешения для главной роли запрещено')
      this.$emit("update:show", true);
      this.$emit("update:action", this.defaultPermissions);
    },

    setMinimumPermissions() {
      if (this.$route.params.id == 1) return this.$toaster.warning('Изменять разрешения для главной роли запрещено')
      this.$emit("update:show", true);
      this.$emit("update:action", this.minimumPermissions);
    },

    async defaultPermissions() {
      const id = this.$route.params.id
      let permissions = await this.$api.adminRoles.permissionsDefault(id)
      this.$emit('update:role_permissions', permissions)
      return true
    },

    async minimumPermissions() {
      const id = this.$route.params.id
      let permissions = await this.$api.adminRoles.permissionsMinimum(id)
      this.$emit('update:role_permissions', permissions)
      return true
    },
  }
}
</script>

<style scoped>
  .permissions-table_footer span {
    cursor: pointer;
  }
</style>
