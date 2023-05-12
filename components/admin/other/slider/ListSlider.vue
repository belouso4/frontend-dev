<template>

  <div class="card">

    <div class="card-header note-float d-flex align-items-center justify-content-between">
      <h3 class="card-title">Список постов в слайдере</h3>
      <Loader v-if="loading" width="15"/>
    </div>

    <div class="card-body p-0">
      <ol class="collection collection-container">
        <!-- The first list item is the header of the table -->
        <li class="item item-container header">
          <div class="attribute">Изображение</div>
          <div class="attribute" data-name="#">Название</div>
          <div class="attribute" data-name="#">Действие</div>
        </li>
        <!-- The rest of the items in the list are the actual data -->
        <vue-nestable :maxDepth="1" v-model="listSlider" class="scroll-table">
          <vue-nestable-handle slot-scope="{ item }" :item="item">
            <li class="item item-container" @mouseup="handleMouseup">
              <div class="attribute"><img width="100" :src="item.img" alt=""></div>
              <div class="attribute">{{ item.title }}</div>
              <div class="attribute">
                <div>
                  <button @click="editSlider(item)" class="btn btn-sm" type="button" title="Редактировать"><i class="fas fa-pencil-alt"></i></button>
                  <button @click.prevent="removeSlide(item.id)" type="button" title="Удалить" class="btn btn-sm">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </li>
          </vue-nestable-handle>
        </vue-nestable>

      </ol>

      <ModalEditSlider :show.sync="show"/>
    </div>

    <div v-if="checkItems()" class="card-footer">
      <button  @click="loadMore()" type="button" class="btn btn-block btn-outline-dark btn-more-load">
        <span v-if="!moreExist">Показать все <Loader v-if="moreLoading" width="15" /></span>
        <span v-else>Скрыть</span>
      </button>

    </div>

  </div>

</template>

<script>
import { VueNestable, VueNestableHandle } from 'vue-nestable'
import 'vue-nestable/example/assets/vue-nestable.css'
import ModalEditSlider from "./ModalEditSlider.vue";
import {mapGetters} from "vuex";

export default {
  name: "ListSlider",
  components: {VueNestable, VueNestableHandle, ModalEditSlider},

  data() {
    return {
      show: false,
      moreExist: false,
      moreLoading: false,
    }
  },

  computed: {
    listSlider: {
      get: function() {
        return this.slider
      },
      set: function(value) {
        this.$store.commit('slider/setSlider', value)
      }
    },

    ...mapGetters({
      slider: 'slider/getSlider',
      sliderCopy: 'slider/getSliderCopy',
      loading: 'slider/loading',
      limit: 'slider/getLimit',
      total: 'slider/getTotal',
    }),

  },

  methods: {

    async loadMore() {
      if(!this.moreExist) {
        this.moreLoading = true

        await this.$store.dispatch('slider/fetchSlider', "all")
        this.$store.commit('slider/setLimit')

        this.moreLoading = false
        this.moreExist = true
      } else {
        this.$store.commit('slider/setSliderLimit')
        this.$store.commit('slider/setLimit', null)
        this.moreExist = false
      }
    },

    checkItems() {
     return !(+this.total <= 5)
    },

    handleMouseup(e) {
     if (e.target.closest('.is-dragging') && !this.checkChanges()) {
      this.updateSlider()
     }
    },

    async updateSlider() {
      this.$store.commit('slider/setLoading', true)
      try {
        let ids = this.slider.map(a => a.id);

        await this.$api.adminOther.update({data: ids})
        await this.$store.dispatch('slider/fetchSlider')
      } catch (err) {console.log(err)}

      this.$store.commit('slider/setLoading', false)
    },

    async removeSlide(id) {
      if (this.loading) return
      this.$store.commit('slider/setLoading', true)

      try {
        await this.$api.adminOther.delete(id)
        await this.$store.dispatch('slider/fetchSlider')
      } catch (err) {console.log(err)}

      this.$store.commit('slider/setLoading', false)
    },

    editSlider(item) {
      this.show = true
      this.$store.commit('slider/setSelectedSlide', {id:item.id,img:item.img})
    },

    checkChanges() {
      let slider = JSON.parse ( JSON.stringify ( this.slider) )
      let sliderCopy = JSON.parse ( JSON.stringify ( this.sliderCopy))

      return this.compareObjects(
        slider,
        sliderCopy
      )
    },

    compareObjects(x, y) {
      var objectsAreSame = true;

      try {
        for (let i = 0; x.length > i; i++) {
          for(var propertyName in x[i]) {
            if (propertyName === 'children') continue

            if(x[i][propertyName] !== y[i][propertyName]) {
              objectsAreSame = false;
              break;
            }
          }
        }
      } catch (err) {console.log(err)}

      return objectsAreSame;
    },
  },
}
</script>

<style>
.btn-more-load span img {
  margin-left: 5px;
  display: inline-block;
}
.item-container > div:first-child {
  padding-left: 1.5rem;
}

.collection-container .nestable-item, .nestable-item-copy {
  margin: 0;
}

.collection .item:not(.collection .item.header) {
  grid-template-rows: 90px
}

.collection .item > div:last-child {
  text-align: center;
  display: grid;
  place-items: center;
}

.attribute {

  padding: 0.75rem;
  border-top: 1px solid #dee2e6;
  /*overflow: hidden;*/
  white-space: nowrap;
  /*text-overflow: ellipsis;*/
}

.attribute img {
  height: 100%;
  object-fit: contain;
}

.attribute:nth-child(2) {
  white-space: normal;
}



ol.collection {
  margin: 0px;
  padding: 0px;
}

li {
  list-style: none;
}

* {
  box-sizing: border-box;
}

/* 2 Column Card Layout */
@media screen and (max-width: 736px) {
  /*.collection-container {*/
  /*  display: grid;*/
  /*  grid-template-columns: 1fr 1fr;*/
  /*  grid-gap: 20px;*/
  /*}*/

  /*.item {*/
  /*  padding: 10px;*/
  /*}*/

  /*!* Don't display the first item, since it is used to display the header for tabular layouts*!*/
  /*.collection-container>li:first-child {*/
  /*  display: none;*/
  /*}*/

  /*.attribute::before {*/
  /*  content: attr(data-name);*/
  /*}*/

  /*!* Attribute name for first column, and attribute value for second column. *!*/
  /*.attribute {*/
  /*  display: grid;*/
  /*  grid-template-columns: minmax(9em, 30%) 1fr;*/
  /*}*/
}

/* 1 Column Card Layout */
@media screen and (max-width:580px) {
  /*.collection-container {*/
  /*  display: grid;*/
  /*  grid-template-columns: 1fr;*/
  /*}*/
}

/* Tabular Layout */
/*@media screen and (min-width: 737px) {*/
  /* The maximum column width, that can wrap */
  .item-container {
    display: grid;
    /*grid-template-columns: 2em 2em 10fr 2fr 2fr 2fr 2fr 5em 5em;*/
    grid-template-columns: 3fr 6fr 2fr;
  }

  .attribute-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));
  }

  /* Definition of wrapping column width for attribute groups. */
  .part-information {
    --column-width-min: 10em;
  }

  .part-id {
    --column-width-min: 10em;
  }

  .vendor-information {
    --column-width-min: 8em;
  }

  .quantity {
    --column-width-min: 5em;
  }

  .cost {
    --column-width-min: 5em;
  }

  .duty {
    --column-width-min: 5em;
  }

  .freight {
    --column-width-min: 5em;
  }

  .collection {
    /*border-top: 1px solid gray;*/
  }

  /* In order to maximize row lines, only display one line for a cell */


  .collection-container>.item-container:first-child {

  }

  /*.item-container.hover-list:hover {*/
  /*  background-color: rgb(200, 227, 252);*/
  /*}*/

  /* Center header labels */
  .collection-container>.item-container:first-child .attribute {
    /*text-overflow: initial;*/
    /*overflow: auto;*/
    /*white-space: normal;*/
    font-weight: bold;
  }
/*}*/
</style>
