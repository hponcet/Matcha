export default profilController

profilController.$inject = ['authService', '$scope', '$http']
function profilController (authService, $scope, $http) {
  let id = authService.getSessionId()
  console.log('id:', id)
  let req = { id: id }
  $http.post('/api/profil', authService.tokenize(req))
  .then(function (res) {
    $scope.user = res.data
  })
}
