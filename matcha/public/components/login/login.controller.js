loginController.$inject = ['$scope', '$http', '$cookies', '$location', 'authService']
function loginController ($scope, $http, $cookies, $location, authService) {
  $scope.errorMsg = ''
  $scope.login = function () {
    const password = authService.hash($scope.log.password)
    const username = $scope.log.username
    $http.post('/api/login', { password: password, username: username })
      .then(function (res) {
        if (!res.data.authentificated) {
          if (res.data.reason === 1) { // User not found
            $scope.errorMsg = 'L\'adresse e-mail fournit ne correspond a aucun compte.'
          } else if (res.data.reason === 2) { // Wrong password
            $scope.errorMsg = 'Le mot de passe fournit ne correspond pas.'
          } else if (res.data.reason === 3) { // Account not validated
            $scope.errorMsg = 'Le compte n\'a pas été validé. Merci de suivre le lien de validation dans le mail qui vous a été envoyé.'
          }
          console.warn(res.data.message)
        } else {
          const expire = new Date(res.data.expire * 1000)
          $cookies.putObject('session', res.data, {expires: expire})
          window.location = '/home'
        }
      })
  }
}
export default loginController
