import angular from 'angular'
export default angular
.module('auth.service', [])
.service('authService', authService)

authService.$inject = ['$http', '$cookies', '$location', '$rootScope', '$q']
function authService ($http, $cookies, $location, $rootScope, $q) {

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
        //AJOUTER UNE FONCTION POUR CHECK COTER SERVER SI LA SESSION EST ACTICVE
        resolve()
      } else {
        resetSession()
        $location.path('/login')
        console.log('[Authentifaction] Failed.')
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
