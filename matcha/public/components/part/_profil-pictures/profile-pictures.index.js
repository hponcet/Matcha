import angular from 'angular'
import ProfilPicturesController from './profile-pictures.controller'
import ProfilPicturesDirective from './profile-pictures.directive'
export default angular
.module('profile-pictures.module', [])
.controller('ProfilPicturesController', ProfilPicturesController)
.directive('profilPictures', ProfilPicturesDirective)
