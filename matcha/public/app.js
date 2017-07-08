'use strict'

import angular from 'angular'
import angularCookies from 'angular-cookies'
import angularSanitize from 'angular-sanitize'
import angularRoute from 'angular-route'
import routes from './routes/routes'

import './components/register/register.index'
import './components/profil/profil-edit/profilEdit.index'
import './components/validate-account/validateAccount.index'
import './components/part/header/header.index'
import './components/login/login.index'
import './components/home/home.index'
import './components/logout/logout.index'
import './components/profil/profil.index'

import './services/auth.service'

const dependencies = [
  angularCookies,
  angularSanitize,
  angularRoute,
  'register.module',
  'header.module',
  'profilEdit.module',
  'login.module',
  'logout.module',
  'home.module',
  'profil.module',
  'auth.service',
  'validateAccount.module'
]

angular
.module('matcha', dependencies)
.run(authentificate)
.config(routes)

function authentificate ($rootScope, authService, $location) {
  const session = authService.getSession()
  $rootScope.session = session
}
