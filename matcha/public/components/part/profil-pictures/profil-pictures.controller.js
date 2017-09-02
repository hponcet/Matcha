const profilPicturesController = ($scope) => {
  console.log('Ca marche !')
  $scope.width = 500
  $scope.image = 'test.jpg'
  $scope.selectionWidth = 300
  $scope.selectionHeight = 300
}

profilPicturesController.$inject = ['$scope']

export default profilPicturesController
