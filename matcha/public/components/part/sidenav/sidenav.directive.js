export default sidenavDirective

function sidenavDirective () {
  return {
    restrict: 'E',
    controller: 'sidenavController',
    templateUrl: './components/part/sidenav/sidenav.view.html'
  }
}
