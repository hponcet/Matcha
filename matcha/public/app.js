'use strict'

import angular from 'angular'
import './components/register/register.index'
import './components/profil-edit/profilEdit.index'
import './components/validate-account/validateAccount.index'
import './components/part/header/header.index'
import './components/login/login.index'
import './components/home/home.index'
import './components/logout/logout.index'
import './components/profil/profil.index'

import './services/auth.service'

angular

.module('matcha', [
  'ngRoute',
  'ngCookies',
  'ngSanitize',
  'register.module',
  'header.module',
  'profilEdit.module',
  'login.module',
  'logout.module',
  'home.module',
  'profil.module',
  'auth.service',
  'validateAccount.module'
])

.run(function ($rootScope, $cookies) {
  var loggedUser = $cookies.getObject('session')
  var guestUser = {
    id: '0',
    pseudo: 'Guest',
    token: '0'
  }
  if (loggedUser != null) {
    $rootScope.session = loggedUser.sessionID
  } else {
    $rootScope.session = guestUser
  }
})

.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
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
    controller: 'homeController'
  })
  .when('/profil', {
    templateUrl: '../components/profil/profil.view.html',
    controller: 'profilController'
  })
  .otherwise('/', {
    templateUrl: '/views/index.htm'
  })
}])
