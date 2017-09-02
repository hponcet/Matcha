import angular from 'angular'
import sidenavDirective from './sidenav.index'
export default angular
.module('sidenav.module', [])
.directive('sidenav', sidenavDirective)
