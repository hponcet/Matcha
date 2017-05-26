export default HeaderController

HeaderController.$inject = ['$scope', '$rootScope']
function HeaderController ($rootScope, $scope) {
  var htmlIndex = '<li><a href="/">Accueil</a></li>'
  var htmlMatchs = '<li><a href="/matchs">Mes matchs</a></li>'
  var htmlFinder = '<li><a href="/finder">Recherche</a></li>'
  var htmlLogin = '<li><a href="/login">Se connécter</a></li>'
  var htmlLogout = '<li><a href="/logout">Déconnexion</a></li>'
  var htmlRegister = '<li><a href="/register">Créer un compte</a></li>'
  var htmlAccount = '<li><a href="/profil">' + $rootScope.session.pseudo + '</a></li>'

  if ($rootScope.session.id === '0') {
    $scope.menu = htmlIndex + htmlLogin + htmlRegister
  } else {
    htmlIndex = '<li><a href="/home">Accueil</a></li>'
    $scope.menu = htmlIndex + htmlFinder + htmlMatchs + htmlAccount + htmlLogout
  }
}
