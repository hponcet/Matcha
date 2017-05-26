export default logoutController

logoutController.$inject = ['$rootScope', '$http', '$cookies']
function logoutController ($rootScope, $http, $cookies) {
  var token = $rootScope.session.token
  $http.post('/api/logout', {'token': token})
  .then(function (res) {
    setTimeout(function () { window.location.href = '/' }, 1000)
    console.log(res.data.message)
  })
  $cookies.remove('session')
}
