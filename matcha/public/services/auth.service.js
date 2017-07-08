import angular from 'angular'
export default angular
.module('auth.service', [])
.service('authService', authService)

authService.$inject = ['$http', '$cookies', '$location', '$rootScope', '$q']
function authService ($http, $cookies, $location, $rootScope, $q) {
  const guest = {
    authentificated: false,
    pseudo: 'Guest',
    token: false
  }

  function resetSession () {
    $cookies.putObject('session', guest)
  }

  function getSession () {
    return $cookies.getObject('session') || guest
  }

  function auth () {
    function authFail () {
      resetSession()
      $location.path('/login')
      console.log('Authentifaction failed.')
    }

    return $q((resolve, reject) => {
      const session = $cookies.getObject('session')
      if (session && session.authentificated && session.token) {
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
    auth: auth,
    getSession: getSession,
    getCurrentUser: getCurrentUser
  }
}
