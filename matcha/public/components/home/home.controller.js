export default homeController

homeController.$inject = ['$scope', '$http', '$rootScope']
function homeController ($scope, $http, $rootScope) {
  if ($rootScope.session.token === '0') {
    window.location.href = '/'
  }
  $scope.sessionID = $rootScope.session.token
}
