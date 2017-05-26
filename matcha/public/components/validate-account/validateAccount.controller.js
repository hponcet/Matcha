export default validateAccountController

validateAccountController.$inject = ['$scope', '$http', '$routeParams']
function validateAccountController ($scope, $http, $routeParams) {
  const REDIRECTION_TIME = 3 * 1000
  var data = atob($routeParams.data)
  var action = $routeParams.action
  var mail = data.split('|')[0]
  var token = data.split('|')[1]

  $scope.validateAccountView = [false, false, false]

  $scope.mail = mail
  $scope.token = token

  if (action === 'validate') {
    $http.get('/api/mail/validate/' + $routeParams.data)
    .then((data) => {
      if (data.data === true) {
        $scope.validateAccountView[2] = true
        setTimeout(() => {
          window.location.href = '/login'
        }, REDIRECTION_TIME)
      } else {
        $scope.validateAccountView[1] = true
      }
    })
  } else if (action === 'error') {
    $http.get('/api/mail/error/' + $routeParams.data)
    $scope.validateAccountView[0] = true
    setTimeout(() => {
      window.location.href = '/'
    }, REDIRECTION_TIME)
  } else {
    window.location.href = '/'
  }
}
