// export default function( { $axios, $auth }, inject ){
//
//   function can($permission) {
//     if (typeof $permission === 'string') {
//       return $auth.user.permission.includes($permission)
//     } else {
//       return $permission.every(r=> $auth.user.permission.indexOf(r) >= 0)
//     }
//   }
//
//   inject('can', can);
// }

export default function( { $axios, $auth }, inject ){

  Vue.directive('can', {
    inserted: (el, binding, vNode) => {
      const hasPermission = can(binding.value)

      if (!hasPermission) el.remove();
    }
  })

  function can($permission) {
    if (typeof $permission === 'string') {
      return $auth.user.permission.includes($permission)
    } else {
      return $permission.every(r=> $auth.user.permission.indexOf(r) >= 0)
    }
  }

  inject('can', can);
}


import Vue from 'vue'




