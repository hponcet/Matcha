import angular from 'angular'
import Crypto from 'crypto-js'
export default angular
.module('auth.service', [])
.service('authService', authService)

authService.$inject = ['$http', '$cookies', '$location', '$rootScope', '$q']
function authService ($http, $cookies, $location, $rootScope, $q) {
  const guest = {
    authentified: false,
    pseudo: 'Guest',
    token: false
  }

  function hash (password) {
    return Crypto.SHA512(password).toString()
  }

  function resetSession () {
    $cookies.putObject('session', guest)
  }

  function getSession () {
    return $cookies.getObject('session') || guest
  }

  function authFail () {
    resetSession()
    $location.path('/login')
    console.log('Authentifaction failed.')
  }

  function auth () {
    return $q((resolve, reject) => {
      const session = $cookies.getObject('session')
      if (session && session.authentified && session.token) {
        $http.post('/api/auth', { id: session.id, token: session.token })
        .then((authentified) => {
          authentified ? resolve() : reject()
        })
      } else {
        authFail()
        reject()
      }
    })
  }

  function getCurrentUser () {
    return $q((resolve, reject) => {
      const session = $cookies.getObject('session')
      if (session && session.authentified && session.token) {
        $http.post('/api/profil', { token: session.token })
          .then((res) => {
            resolve(res.data)
          })
      } else {
        resetSession()
        $location.path('/login')
      }
    })
  }

  return {
    hash,
    auth,
    getSession,
    getCurrentUser
  }
}
