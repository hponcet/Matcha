import angular from 'angular'
export default angular
.module('auth.service', [])
.service('authService', authService)

authService.$inject = ['$http', '$cookies', '$location']
function authService ($http, $cookies, $location) {
  return {
    tokenize: (obj) => {
      let loggedUser = $cookies.getObject('session')
      console.log(loggedUser)
      if (loggedUser) {
        obj.auth = {
          token: loggedUser.token,
          id: loggedUser.id
        }
      } else {
        obj.auth = {
          token: null,
          id: null
        }
      }
      return obj
    },
    getSessionId: () => {
      let loggedUser = $cookies.getObject('session')
      if (loggedUser) {
        return loggedUser.id
      } else {
        $location.path('/login')
        throw 'ERROR: You need to login.'
      }
    }
  }
}
