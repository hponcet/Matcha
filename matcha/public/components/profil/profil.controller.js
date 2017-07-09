export default profilController

profilController.$inject = ['currentUser', 'authService', '$scope', '$rootScope', '$http', '$routeParams']
function profilController (currentUser, authService, $scope, $rootScope, $http, $routeParams) {
  const id = $routeParams.id
  const session = authService.getSession()
  if (id) {
    $http.post('/api/users/id', { token: session.token, id: session.id, user: id })
    .then((user) => {
      console.log(user)
      if (user) $scope.user = user.data
      else $scope.user = currentUser
    })
  } else {
    console.log(currentUser)
    $scope.user = currentUser
  }
}
