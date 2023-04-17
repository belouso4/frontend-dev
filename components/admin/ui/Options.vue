<template>
  <div v-else class="form-group form-select" data-select2-id="29">

    <div v-click-outside="optionsClose" @click="eventClick()" class="select-cust">
      {{ name || placeholder }}
    </div>

    <div v-show="show" class="option-cust">
      <div v-if="inputShow" class="select2-search select2-search--dropdown">
        <input @keyup="fetch" type="search" autocomplete="off" autocorrect="off" v-model="search">
      </div>
      <div class="select2-results">
        <ul class="select2-results__options">
          <slot></slot>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Options",
  props: {
    name: {
      type: String,
      default: ''
    },
    inputShow: {
      type: Boolean,
      default: true
    },
    fetch: {
      type: Function,
      default: () => {}
    },
    list: {
      type: Array,
      default: []
    },
    placeholder: {
      type: String,
      default: '--Выберите эллемент--'
    }
  },
  data() {
    return {
      show: false,
      search: ''
    }
  },
 // created() {
 //   this.$emit('update:list', [])
 // },

  methods: {
    optionsClose(e) {
      let option = this.$el.querySelector('.option-cust')
      // this.$emit('update:list', [])
      // this.search = ''

      if(!option.contains(e.target)) {
        this.show =false
      }
    },
    eventClick() {
      if (!this.show) this.fetch()

      return this.show = !this.show
    }
  }
}
</script>

<style scoped>

.select-cust {
  border: 1px solid #ced4da;
  padding: 0.46875rem 0.75rem;
  height: calc(2.25rem + 2px);
  background-color: #fff;
  /*border: 1px solid #aaa;*/
  border-radius: 4px;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.select-cust:after {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-style: solid;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
  border-top: 5px solid #888;
  border-bottom: 0;
}

.option-cust {
  /*display: none;*/
  position: absolute;

  background-color: white;
  border: 1px solid #aaa;
  border-radius: 4px;
  box-sizing: border-box;
  display: block;
  width: 100%;
  z-index: 1051;
}

.option-cust > div:first-child {
  padding: 4px;
}

.option-cust > div:first-child input {
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  width: 100%;
}

.option-cust > div:last-child {
  padding: 4px;
}

.option-cust > div:last-child ul {
  max-height: 200px;
  overflow-y: auto;
}

.option-cust > div:last-child li {
  padding: 6px 12px;
  cursor: pointer;
}

.option-cust > div:last-child li:hover {
  background-color: #0074f0;
  color: #fff;
}

.option-cust > div:last-child li.active {
  background-color: #0074f0;
  color: #fff;
}

.form-select {
  flex: 1 auto;
  margin-bottom: 0;
  position: relative;
}
</style>
