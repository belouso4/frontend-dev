import Vue from "vue";
import Loader from "~/components/Ui/Loader";
import Options from "~/components/admin/ui/Options";
import ButtonLoader from "~/components/admin/ui/ButtonLoader";

Vue.component('Loader',Loader)
Vue.component('Options',Options)
Vue.component('ButtonLoader',ButtonLoader)


Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his childrens
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});
