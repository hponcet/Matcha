export default homeController

homeController.$inject = ['$scope', '$http', '$rootScope']
function homeController ($scope, $http, $rootScope) {
  $scope.sessionID = $rootScope.session.token
}
