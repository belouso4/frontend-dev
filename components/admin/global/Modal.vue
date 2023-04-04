<template>
  <transition name="fade"
              :duration="{ enter: 300, leave: 300 }"
              @after-enter="onAfterEnter"
              @after-leave="onAfterLeave">
    <div class="custom-model fade"
         :class="[{'show': showAnimate}]"
         v-show="show"
         @mousedown.self="closeModal">
      <div class="modal-dialog" :class="[size,marginLg]">
        <div :class="['modal-content', bg]">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "modal",
  props: {
    show: Boolean,
    size: {
      type: String,
      defaults: ''
    },
    marginLg: {
      type: String,
      defaults: ''
    },
    bg: {
      type: String,
      defaults: ''
    }
  },
  data() {
    return {
      showAnimate: false
    }
  },
  watch: {
    show(val) {
      let documentClasses = document.body.classList,
          scroll = this.calcScroll()

      if (val) {

        documentClasses.add("modal-open");
        if(this.checkScrollBar()) {
          document.body.style.marginRight = `${scroll}px`;
        }
      } else {
        this.showAnimate = false
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit("close-modal");
    },
    onAfterEnter(el) {
      this.showAnimate = true
    },
    onAfterLeave(el) {
      document.body.style.marginRight = `0px`;
      document.body.classList.remove("modal-open");
    },

    calcScroll () {
      let div = document.createElement('div');

      div.style.width = '53px';
      div.style.height = '53px';
      div.style.overflow = 'scroll';
      div.style.visibility = 'hidden';

      document.body.appendChild(div);
      let scrollWidth = div.offsetWidth - div.clientWidth;
      div.remove();

      return scrollWidth;
    },

    checkScrollBar() {
      if(-[1,]){
        if (document.body.offsetHeight > window.innerHeight + 1) {
          return true
        } else {
          return false
        }

      } else {
        if (document.body.offsetHeight < document.documentElement.clientHeight) {
          return true
        }
        else {
          return false
        }
      }
    }
  },

}

</script>

<style scoped>
.custom-model {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: 0;
  background-color: rgb(0 0 0 / 52%);
}

.modal-open .custom-model {
  overflow-x: hidden;
  /*overflow-y: auto;*/
  overflow-y: hidden;
}

.custom-model .modal-content .modal-body {
  overflow: auto;
  max-height: 621px;
  height: 100%;
}

.custom-model.fade .modal-dialog {
  transition: -webkit-transform .3s ease-out;
  transition: transform .3s ease-out;
  transition: transform .3s ease-out,-webkit-transform .3s ease-out;
  -webkit-transform: translate(0,-50px);
  transform: translate(0,-50px);
}

.custom-model.show .modal-dialog {
  -webkit-transform: none;
  transform: none;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}

.fade-enter, .fade-leave-to{
  opacity: 0;
}

.modal-dialog.margin-lg{
  margin: 10.75rem auto;
}

</style>
