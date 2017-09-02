import angular from 'angular'
import profilSectionController from './profil-section.controller'
export default angular
.module('profil-section.module', [])
.controller('profilSectionController', profilSectionController)
.directive('profilSection', () => {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: './components/profil/profil-section.template.html',
    controller: 'profilSectionController',
    scope: {
      item: '=item',
      user: '=user',
      place: '@',
      editable: '@',
      type: '@'
    },
    link: (scope, element, attrs) => {
      scope.editable = attrs.editable,
      scope.place = attrs.place
      scope.type = attrs.type
      scope.title = attrs.title
    }
  }
})
