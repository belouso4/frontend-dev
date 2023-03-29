export default function( { $axios, $auth, store }, inject ) {

let toaster = {
  info, error, warning, success
}

  function info(msg) {
    fetch('toast-info', msg)
  }

  function error(msg) {
    fetch('toast-error', msg)
  }

  function warning(msg) {
    fetch('toast-warning', msg)
  }

  function success(msg) {
    fetch('toast-success', msg)
  }

  function fetch(color = 'toast-success', msg, show = true) {
    store.dispatch('toaster/setToasterShow', {show, color, msg})
  }

  inject('toaster', toaster);
}





