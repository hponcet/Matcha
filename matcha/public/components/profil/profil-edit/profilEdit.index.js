import angular from 'angular'
import profilEditController from './profilEdit.controller'
import profilEditDirective from './profilEdit.directive'
export default angular
.module('profilEdit.module', [])
.controller('profilEditController', profilEditController)
.directive('profilEdit', profilEditDirective)
