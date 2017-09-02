const profilSectionController = ($scope, $rootScope, $http) => {
  $scope.textarea = false
  $scope.tags = false
  $scope.text = false
  if ($scope.type === 'textarea') {
    $scope.textarea = true
  } else if ($scope.type === 'tags') {
    $scope.tags = true
  } else {
    $scope.text = true
  }

  $scope.profilEdit = () => {
    $scope.showItemEdit = true
    if ($scope.type !== 'tags') {
      $scope.prevData = $scope.item + ''
    } else {
      $scope.prevData = JSON.stringify($scope.item)
    }
  }

  $scope.updateProfil = (place, item) => {
    $http.post('/api/users/update', {
      id: $rootScope.session.id,
      token: $rootScope.session.token,
      place: place,
      data: item
    })
    .catch((err) => {
      console.log(err)
    })
    $scope.showItemEdit = false
  }

  $scope.updateCancel = () => {
    if ($scope.type !== 'tags') {
      $scope.item = $scope.prevData
    } else {
      $scope.item = JSON.parse($scope.prevData)
    }
    $scope.showItemEdit = false
  }
}

profilSectionController.$inject = ['$scope', '$rootScope', '$http']

export default profilSectionController
