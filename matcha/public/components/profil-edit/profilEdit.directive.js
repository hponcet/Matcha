export default profilEditDirective

function profilEditDirective () {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: './components/profil-edit/profil-edit.view.html'
  }
}
