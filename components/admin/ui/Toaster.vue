<template>
    <div id="toast-container" class="toast-top-right">
      <transition name="toaster" @after-enter="onAfterEnter" :key="'elem-'+index" v-for="(item, index) in $store.getters['toaster/getToaster']">
        <div v-show="item.show"
             @mouseleave="$store.dispatch('toaster/setStartTimeout', item.id)"
             @mouseenter="$store.dispatch('toaster/setToasterTimeout', item.id)"
             class="toast toast-success"
             :class="[{'showing': showAnimate}, item.color]"
             aria-live="polite" style="">
          <div class="toast-message">{{ item.msg }}</div>
        </div>
      </transition>
    </div>
</template>

<script>
export default {
  name: "Toaster",
  data() {
    return {
      showAnimate: false,
      class: ['toast-success', 'toast-warning', 'toast-info', 'toast-error']
    }
  },
  created() {

  },
  methods: {
    onAfterEnter(el) {
      this.showAnimate = true
    },
  }
}
</script>

<style scoped>
.toaster-enter-active {
  transition: opacity 0.5s ease;
}

.toaster-leave-active {
  transition: opacity 2s ease;
}

#toast-container>div.showing {
  opacity: 0.8;
}

.toaster-enter, .toaster-leave-to{
  opacity: 0 !important;
}

</style>
