FinderController.$inject = ['authService', '$scope', '$http', '$rootScope']
function FinderController (authService, $scope, $http, $rootScope) {
  const session = authService.getSession()
  $http.post('/api/search/km', {
    id: session.id,
    token: session.token,
    distance: 5000
  })
  .then((users) => {
    $scope.users = users
    console.log('users: ', users)
  })
}

export default FinderController
