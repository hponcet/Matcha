registerController.$inject = ['$scope', '$http', '$location', 'RegisterService', 'authService']
function registerController ($scope, $http, $location, RegisterService, authService) {
  $scope.registerView = [true, false, false]
  $scope.master = {
    'sex': 'H'
  }
  // Load profil edits
  $scope.showProfil = false
  $scope.toggle = function (scope) {
    $scope.showProfil = !$scope.showProfil
  }
  // Reset form with master data
  $scope.reset = function () {
    $scope.user = angular.copy($scope.master)
  }
  // Init form with master data
  $scope.reset()

  let dates = RegisterService.dates
  $scope.ldays = dates.days
  $scope.lmonths = dates.months
  $scope.lyears = dates.years()
  $scope.getYear = function () {
    var birth = $scope.date.day + '/' + $scope.date.month + '/' + $scope.date.year
    $scope.user.birth = birth
  }
  // Check Validity
  $scope.emailValidity = false
  $scope.pseudoValidity = false
  $scope.checkEmail = function () {
    $http.get('/api/check/mail/' + $scope.user.mail)
    .then((res) => {
      if (res.data === false) {
        $scope.emailValidity = false
      } else {
        $scope.emailValidity = true
      }
    })
  }
  $scope.checkPseudo = function () {
    $http.get('/api/check/pseudo/' + $scope.user.pseudo)
    .then(function (res) {
      if (res.data === false) {
        $scope.pseudoValidity = false
      } else {
        $scope.pseudoValidity = true
      }
    })
  }
  // Submit part
  $scope.register = function (user) {
    if ($scope.user.mail !== $scope.emailConfirm) {
      $scope.emailConfirm = ''
    } else if (!$scope.pseudoValidity && !$scope.emailValidity) {
      let user = JSON.parse(JSON.stringify($scope.user))
      user.password = authService.hash($scope.user.password)
      $http.post('/api/register', user)
      .then($scope.registerView = [false, true, true])
    }
  }
  $scope.reSend = () => {
    $http.get('/api/mail/resend/' + btoa($scope.user.mail))
    $scope.registerView = [false, true, false]
  }
}
export default registerController
