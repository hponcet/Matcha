export default profilController

profilController.$inject = ['currentUser', '$scope', '$rootScope', '$http']
function profilController (currentUser, $scope, $rootScope, $http) {
  $scope.user = currentUser
}
