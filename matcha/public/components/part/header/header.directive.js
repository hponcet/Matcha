export default HeaderDirective

function HeaderDirective () {
  return {
    restrict: 'E',
    controller: 'HeaderController',
    templateUrl: './components/part/header/header.view.html'
  }
}
