export default profilController

profilController.$inject = ['currentUser', 'authService', '$scope', '$rootScope', '$http', '$routeParams']
function profilController (currentUser, authService, $scope, $rootScope, $http, $routeParams) {
  $scope.user = currentUser
  if (!currentUser.profilPic) {
    const sex = (currentUser.sex === '1') ? 'H' : 'F'
    $scope.firstProfilPic = '/img/empty_' + sex + '.png'
  }
}
