import angular from 'angular'
import ProfilPicturesController from './profil-pictures.controller'
import ProfilPicturesDirective from './profil-pictures.directive'
// import 'pm-image-editor'
export default angular
.module('profil-pictures.module', [])
.controller('profilPicturesController', ProfilPicturesController)
.directive('profilPictures', ProfilPicturesDirective)
