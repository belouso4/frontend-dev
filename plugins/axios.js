export default function({app, route, $axios, $auth, redirect, store, error: nuxtError}) {
  // handle api errors
  // $axios.setBaseURL('http://172.19.0.5')

  $axios.onError(error => {
    console.log('message: ',error.response.data)
    console.log(error)
    const code = parseInt(error.response && error.response.status)
    const url = route?.path.split('/')
    // const url = app.context.from.path.split('/')

    // switch (error.response.status) {
    //   case 401: // Not logged in
    //   case 419: // Session expired
    //   case 503: // Down for maintenance
    //     // Bounce the user to the login screen with a redirect back
    //     window.location.reload();
    //     break;
    //   case 500:
    //     alert('Oops, something went wrong!  The team have been notified.');
    //     break;
    //   default:
    //     // Allow individual requests to handle other errors
    //     return Promise.reject(error);

    if (code === 404) {
      nuxtError({
        statusCode: error.response.status,
        message: 'Такой страницы не существует',
      });

      // if (url && url[1] === 'admin') {
      //   return Promise.resolve(false);
      // }
    }

    if (code === 500) {
      nuxtError({
        statusCode: error.response.status,
        message: error.message,
      });
    }

    if (code === 422) {
      for (const [key, value] of Object.entries(error.response.data.errors)) {
        app.$toaster.error(value[0])
      }
      // return Promise.resolve(false);
    }

    if (process.server) {}
    if (process.client && url && url[1] === 'admin') {
      // if (code === 404 || code === 500) {
      //   redirect('/admin/404');
      // }
      if (code === 409) {
        app.$toaster.warning(error.response.data)
      }
    }

    if (code === 422) {
      store.dispatch('validation/setErrors', error.response.status)
    }

    // logout the user if the session expired
    if (app.$auth.loggedIn && [401, 419].includes(code) || error.response?.data.ban === 1) {
      logout()
      return Promise.resolve(false);
    }
    // throw other errors
    return Promise.reject(error)
  })

  $axios.onRequest((config) => {
    config.progress = false;
    store.dispatch('validation/clearErrors')
  })

  async function logout() {
    await app.$auth.logout()
    // app.$auth.setToken('local', false)
    // store.commit('alerts/removeAll')
    // if(process.client) {
    //   if (route.path !== '/login') {
    //     redirect({ name: 'login' })
    //   }
    // }

  }
}
