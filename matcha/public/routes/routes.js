export default routes

routes.$inject = ['$routeProvider', '$locationProvider']
function routes ($routeProvider, $locationProvider) {
  const auth = (authService) => {
    return authService.auth()
  }

  const getCurrentUser = (authService) => {
    return authService.getCurrentUser()
  }

  $locationProvider.html5Mode(true)
  $routeProvider
  .when('/', {
    templateUrl: '/views/index.htm'
  })
  .when('/error', {
    templateUrl: '/views/error.htm'
  })
  .when('/register', {
    templateUrl: '../components/register/register.view.html',
    controller: 'registerController'
  })
  .when('/mail/:action/:data', {
    templateUrl: '../components/validate-account/validate-account.view.html',
    controller: 'validateAccountController'
  })
  .when('/login', {
    templateUrl: '../components/login/login.view.html',
    controller: 'loginController'
  })
  .when('/logout', {
    templateUrl: '../components/logout/logout.view.html',
    controller: 'logoutController'
  })
  .when('/home', {
    templateUrl: '../components/home/home.view.html',
    controller: 'FinderController',
    resolve: {
      'auth': auth,
      'currentUser': getCurrentUser
    }
  })
  .when('/finder', {
    templateUrl: '../components/finder/finder.view.html',
    controller: 'FinderController',
    resolve: {
      'auth': auth,
      'currentUser': (authService) => {
        return authService.getCurrentUser()
      }
    }
  })
  .when('/profil', {
    templateUrl: '../components/profil/profil.view.html',
    controller: 'profilController',
    resolve: {
      'auth': auth,
      'currentUser': getCurrentUser
    }
  })
  .when('/profil/:id', {
    templateUrl: '../components/profil/profil.view.html',
    controller: 'profilController',
    resolve: {
      'auth': auth,
      'currentUser': getCurrentUser
    }
  })
  .otherwise('/', {
    templateUrl: '/views/index.htm'
  })
}
