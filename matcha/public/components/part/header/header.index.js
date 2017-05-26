import angular from 'angular'
import HeaderController from './header.controller'
import HeaderDirective from './header.directive'
export default angular
.module('header.module', [])
.controller('HeaderController', HeaderController)
.directive('headerZone', HeaderDirective)
