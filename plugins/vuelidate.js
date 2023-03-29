import Vue from 'vue'
import Vuelidate from 'vuelidate'
import vuelidateErrorExtractor, { templates } from "vuelidate-error-extractor";

// Вы должны заполнить поле {attribute}, чтобы продолжить
Vue.use(Vuelidate)
Vue.use(vuelidateErrorExtractor, {
  messages: {
    required: "Поле {attribute} обязательно для заполнения." ,
    minLength: "Поле {attribute} должно быть не короче {min} символов" ,
    fileImg: "Поддерживаемые типы файлов - jpeg, jpg, png, gif" ,
    filSize: 'Размер файла превышает 1 МБ' ,
  },
})
Vue.component("form-group", templates.singleErrorExtractor.foundation6);


