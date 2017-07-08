export default profilEditController

profilEditController.$inject = ['$scope', '$http']
function profilEditController ($scope, $http) {
  $scope.nbDpt = null
  $scope.pcodes = []
  $scope.getCities = function () {
    $http.get('/api/citydb/' + $scope.user.dptNb)
    .then(function (data) {
      console.log('getCities', data)
      $scope.cities = data.data
    })
  }
  $scope.getPCode = function () {
    console.log($scope.user.dptNb + '/' + $scope.user.city)
    $http.get('/api/citydb/' + $scope.user.dptNb + '/' + $scope.user.city)
    .then(function (data) {
      $scope.pcodes = data.data
      console.log('getPCode', $scope.pcodes)
    })
  }
  $http.get('/api/citydb/dpts')
  .then(function (data) {
    console.log(data)
    $scope.dpts = data.data
  })
}
