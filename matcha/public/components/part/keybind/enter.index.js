import angular from 'angular'
export default angular
.module('keybind.module', [])
.directive('keyEnter', function () {
  return function (scope, element, attrs) {
    element.bind('keydown keypress', function (event) {
      if (event.which === 13) {
        scope.$apply(() => {
          scope.$eval(attrs.keyEnter)
        })
        event.preventDefault()
      }
    })
  }
})
