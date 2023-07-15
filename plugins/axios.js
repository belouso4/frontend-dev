export default function({app, route, $axios, $auth, redirect, store, error: nuxtError}) {

  $axios.onError(error => {
    console.log('message: ',error.response.data)

    const code = parseInt(error.response && error.response.status)
    const url = route?.path.split('/')

    switch (code) {
      case 401: // Not logged in

        if (app.$auth.loggedIn) {
          logout()

          return Promise.resolve(false);
        }

        break
      case 403: // Not logged in

        if (error.response?.data.ban === 1) {
          logout()

          return Promise.resolve(false);
        }

        break
      case 404: // Not logged in

        nuxtError({
          statusCode: error.response.status,
          message: 'Такой страницы не существует',
        });

        break;
      case 409: // Session expired

        if (process.client && url && url[1] === 'admin') {
          app.$toaster.warning(error.response.data)
        }

        break;
      case 419: // Session expired

        if (app.$auth.loggedIn) {
          logout()

          return Promise.resolve(false);
        }

        break
      case 422: // Session expired
        store.dispatch('validation/setErrors', error.response.status)

        if (process.client && url && url[1] === 'admin') {
          for (const [key, value] of Object.entries(error.response.data.errors)) {
            app.$toaster.error(value[0])
          }
        }

        break;
      case 503: // Down for maintenance
        // Bounce the user to the login screen with a redirect back
        window.location.reload();
        break;
      case 500:

        nuxtError({
          statusCode: error.response.status,
          message: error.message,
        });

        break;
      default:
        // Allow individual requests to handle other errors
        return Promise.reject(error)
    }
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
