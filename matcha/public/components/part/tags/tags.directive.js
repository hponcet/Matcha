export default tagsDirective

function tagsDirective () {
  return {
    restrict: 'E',
    controller: 'tagsController',
    templateUrl: './components/part/tags/tags.view.html'
  }
}
