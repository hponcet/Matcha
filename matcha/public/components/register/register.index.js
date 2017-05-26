import angular from 'angular'
import registerController from './register.controller'
import RegisterService from './register.service'
export default angular
.module('register.module', [])
.controller('registerController', registerController)
.service('RegisterService', RegisterService)
