import angular from 'angular'
import tagsController from './tags.controller'
import tagsDirective from './tags.directive'
export default angular
.module('tags.module', [])
.controller('tagsController', tagsController)
.directive('tags', tagsDirective)
