'use strict'

import angular from 'angular'
import angularCookies from 'angular-cookies'
import angularSanitize from 'angular-sanitize'
import angularRoute from 'angular-route'

import './components/register/register.index'
import './components/profil/profil-edit/profilEdit.index'
import './components/validate-account/validateAccount.index'
import './components/part/header/header.index'
import './components/part/tags/tags.index'
import './components/part/keybind/enter.index'
import './components/login/login.index'
import './components/home/home.index'
import './components/logout/logout.index'
import './components/finder/finder.index'
import './components/profil/profil.index'
import './components/profil/profil-section.directive'
import './components/part/profil-pictures/profil-pictures.index'

import routes from './routes/routes'
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
  'validateAccount.module',
  'tags.module',
  'keybind.module',
  'profil-section.module',
  'profil-pictures.module',
  'finder.module'
]

angular
.module('matcha', dependencies)
.run(authentificate)
.config(routes)

function authentificate ($rootScope, authService, $location) {
  $rootScope.session = authService.getSession()
}
