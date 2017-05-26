export default profilEditController

profilEditController.$inject = ['$scope', '$http']
function profilEditController ($scope, $http) {
  $scope.nbDpt = null
  $scope.getCities = function () {
    $http.get('/api/citydb/' + $scope.user.dptNb)
    .then(function (data) {
      $scope.cities = data.data
    })
  }
  $scope.getPCode = function () {
    $http.get('/api/citydb/' + $scope.user.dptNb + '/' + $scope.user.city)
    .then(function (data) {
      $scope.pcodes = data.data
    })
  }
  $http.get('/api/citydb/dpts')
  .then(function (data) {
    $scope.dpts = data.data
  })
}
