export default HeaderController

HeaderController.$inject = ['$scope', '$rootScope']
function HeaderController ($rootScope, $scope) {
  const session = $rootScope.session

  $scope.authentified = session.authentified
  $scope.username = session.pseudo
}
