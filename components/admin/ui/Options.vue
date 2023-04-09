<template>
  <div v-else class="form-group form-select" data-select2-id="29">

    <div v-click-outside="optionsClose" @click="show = !show" class="select-cust">
      {{ name ? name : 'email@gmail.com' }}
    </div>

    <div v-show="show" class="option-cust">
      <div class="select2-search select2-search--dropdown">
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
    fetch: {
      type: Function
    },
    list: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      show: false,
      search: ''
    }
  },
 created() {
   this.$emit('update:list', [])
 },

  methods: {
    optionsClose(e) {
      let option = this.$el.querySelector('.option-cust')
      this.$emit('update:list', [])
      this.search = ''

      if(!option.contains(e.target)) {
        this.show =false
      }
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
  border: 1px solid #aaa;
  border-radius: 4px;
  width: 100%;
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
</style>
