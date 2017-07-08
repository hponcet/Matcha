import angular from 'angular'
import Crypto from 'crypto-js'
export default angular
.module('auth.service', [])
.service('authService', authService)

authService.$inject = ['$http', '$cookies', '$location', '$rootScope', '$q']
function authService ($http, $cookies, $location, $rootScope, $q) {
  function hash (password) {
    return Crypto.SHA512(password).toString()
  }

  function resetSession () {
    const session =
      {
        authentificated: false,
        pseudo: 'Guest',
        token: false
      }
    $cookies.putObject('session', session)
  }

  function getSession () {
    const session = $cookies.getObject('session') ||
      {
        authentificated: false,
        pseudo: 'Guest',
        token: false
      }
    return session
  }

  function auth () {
    return $q((resolve, reject) => {
      const session = $cookies.getObject('session')
      if (session && session.authentificated && session.token) {
        $http.post('/api/auth', {token: session.token})
          .then((res) => {
            if (res.data.auth) {
              resolve()
            } else {
              resetSession()
              $location.path('/login')
              console.log('401: Authentification failed.')
            }
          })
      } else {
        resetSession()
        $location.path('/login')
        console.log('401: Authentification failed.')
      }
    })
  }

  function getCurrentUser () {
    return $q((resolve, reject) => {
      const session = $cookies.getObject('session')
      if (session && session.authentificated && session.token) {
        $http.post('/api/profil', { token: session.token })
          .then((res) => {
            resolve(res.data.data)
          })
      } else {
        resetSession()
        $location.path('/login')
      }
    })
  }

  return {
    hash: hash,
    auth: auth,
    getSession: getSession,
    getCurrentUser: getCurrentUser
  }
}
