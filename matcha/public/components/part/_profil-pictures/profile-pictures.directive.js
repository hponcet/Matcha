import path from 'path'

function ProfilPicturesDirective () {
  return {
    restrict: 'E',
    controller: 'ProfilPicturesDirective',
    templateUrl: path('./profil-pictures.view.html'),
    resolve: {
      'currentUser': (authService) => {
        return authService.getCurrentUser()
      }
    }
  }
}

export default ProfilPicturesDirective
