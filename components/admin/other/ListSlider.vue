<template>
  <ol class="collection collection-container">
    <!-- The first list item is the header of the table -->
    <li class="item item-container header">
      <div class="attribute">Изображение</div>
      <div class="attribute" data-name="#">Название</div>
      <div class="attribute" data-name="#">Действие</div>
    </li>
    <!-- The rest of the items in the list are the actual data -->
    <vue-nestable :maxDepth="1" v-model="listSlider">
      <vue-nestable-handle slot-scope="{ item }" :item="item">
        <li class="item item-container" @mouseup="handleMouseup">
          <div class="attribute"><img width="100" :src="item.img" alt=""></div>
          <div class="attribute">{{ item.title }}</div>
          <div class="attribute">
            <button @click="editCategory(item)" class="btn btn-sm" type="button" title="Редактировать"><i class="fas fa-pencil-alt"></i></button>
            <button @click="removeSlide(item.id)" type="button" title="Удалить" class="btn btn-sm">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </li>
      </vue-nestable-handle>
    </vue-nestable>

  </ol>
</template>

<script>
import { VueNestable, VueNestableHandle } from 'vue-nestable'
import 'vue-nestable/example/assets/vue-nestable.css'

export default {
  name: "ListSlider",
  components: {VueNestable, VueNestableHandle},
  props: [
    'slider',
    'removeSlide',
    'checkChanges',
    'updateSlider'
  ],

  computed: {
    listSlider: {
      get: function() {
        return this.slider
      },
      set: function(value) {
        this.$emit('update:slider', value)
      }
    }
  },

  methods: {
    handleMouseup(e) {
      console.log(this.checkChanges())
     if (!this.checkChanges()) {
      this.updateSlider()
     }
    },
  },
}
</script>

<style>
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

  .item-container:hover {
    background-color: rgb(200, 227, 252);
  }

  /* Center header labels */
  .collection-container>.item-container:first-child .attribute {
    /*text-overflow: initial;*/
    /*overflow: auto;*/
    /*white-space: normal;*/
    font-weight: bold;
  }
/*}*/
</style>
