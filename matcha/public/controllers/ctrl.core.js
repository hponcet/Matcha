'use strict';

angular.module('matcha', ['ngRoute', 'ngCookies', 'ngSanitize'])

//-- Global variables in $rootScope --//
.run(function($rootScope, $cookies) {
	var loggedUser = $cookies.getObject('session');
	var guestUser = {
		id: '0',
		pseudo: 'Guest',
		token: '0'
	};
	if (loggedUser != null) {
		$rootScope.session = loggedUser.sessionID;
	} else {
		$rootScope.session = guestUser;
	}
})
//-- Controller --//

.controller("headerCtrl", ['$scope', '$rootScope', function($rootScope, $scope) {


	var htmlIndex = '<li><a href="/">Accueil</a></li>';
	var htmlMatchs = '<li><a href="/matchs">Mes matchs</a></li>';
	var htmlFinder = '<li><a href="/finder">Recherche</a></li>';
	var htmlLogin = '<li><a href="/login">Se connécter</a></li>';
	var htmlLogout = '<li><a href="/logout">Déconnexion</a></li>';
	var htmlRegister = '<li><a href="/register">Créer un compte</a></li>';
	var htmlAccount = '<li><a href="/account">' + $rootScope.session.pseudo + '</a></li>';

	if ($rootScope.session.id === '0') {
		$scope.menu = htmlIndex + htmlLogin + htmlRegister;
	} else {
		htmlIndex = '<li><a href="/home">Accueil</a></li>';
		$scope.menu = htmlIndex + htmlFinder + htmlMatchs + htmlAccount + htmlLogout;
	};

}])

.controller("registerCtrl", ['$scope', '$http', '$location', function($scope, $http) {
	// Get geolocation by IP
	$http.get("/api/ipinfo")
		.then(function(res) {
	  		$scope.user.geoData = res.data;
		})
	// master data
	$scope.master = {
		"sex": 'H'
	};
	// Load profil edits
	$scope.showProfil = false;
	$scope.toggle = function(scope) {
		$scope.showProfil = !$scope.showProfil
	};
	// Reset form with master data
	$scope.reset = function() {
        $scope.user = angular.copy($scope.master);
    };
	// Init form with master data
	$scope.reset();
	// Birthday part
	var genYear = function (minYear, currYear) {
		var tab = [];
		for (var i = minYear; i <= currYear; i++) {
			tab.push(i.toString());
		}
		return tab;
	};
	var days 		= ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
	var months 		= [{"nb": "01", "name": "Janvier"}, {"nb": "02", "name": "Février"}, {"nb": "03", "name": "Mars"}, {"nb": "04", "name": "Avril"}, {"nb": "05", "name": "Mai"}, {"nb": "06", "name": "Juin"}, {"nb": "07", "name": "Juillet"}, {"nb": "08", "name": "Août"}, {"nb": "09", "name": "Septembre"}, {"nb": "10", "name": "Octobre"}, {"nb": "11", "name": "Novembre"}, {"nb": "12", "name": "Décembre"}];
	var currentDate = new Date();
	var years 		= genYear(1900, currentDate.getFullYear());

	$scope.ldays 	= days;
	$scope.lmonths 	= months;
	$scope.lyears 	= years;
	$scope.getYear 	= function () {
		var birth = $scope.date.day + '/' + $scope.date.month + '/' + $scope.date.year;
		$scope.user.birth = birth;
	}
	// Check Validity
	$scope.emailValidity = false;
	$scope.pseudoValidity = false;
	$scope.checkEmail = function () {
		$http.get('/api/check/mail/' + $scope.user.mail)
			.then( function (res) {
				if (res.data == false)
					$scope.emailValidity = false;
				else
					$scope.emailValidity = true;
			})
	};
	$scope.checkPseudo = function () {
		$http.get('/api/check/pseudo/' + $scope.user.pseudo)
			.then( function (res) {
				if (res.data == false)
					$scope.pseudoValidity = false;
				else
					$scope.pseudoValidity = true;
			})
	};
	// Submit part
	$scope.register = function(user) {
		if ($scope.user.mail !== $scope.emailConfirm) {
			$scope.emailConfirm = "";
		} else if (!$scope.pseudoValidity && !$scope.emailValidity) {
        	$http.post('/api/register', $scope.user)
			var url = "/register/confirm-" + window.btoa($scope.user.mail);
			window.location.href = url;
		}
    };
}])

.controller("registerConfirmCtrl", ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.mail = atob($routeParams.data);
}])

.controller("mailValidateCtrl", ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	var data = atob($routeParams.data);
	var action = $routeParams.action;
	var mail = data.split('|')[0];
	var token = data.split('|')[1];

	$scope.mail = mail;
	$scope.token = token;

	if (action == 'validate') {
		$http.get('/api/mail/validate/' + $routeParams.data)
			.then(function (data) {
				if (data.data == true) {
					$scope.validatePage = '/views/validate/mail-validate-success.htm';
					// redirection after 3s
					setTimeout(function () {window.location.href = "/login"}, 3*1000);
				} else {
					$scope.validatePage = '/views/validate/mail-validate-error.htm'
				}
			})

	} else if (action == 'error') {
		$http.get('/api/mail/error/' + $routeParams.data);
		$scope.validatePage = '/views/validate/mail-error.htm';
		// redirection after 3s
		setTimeout(function () {window.location.href = "/"}, 3*1000);

	} else {
		window.location.href = "/";
	};
}])

.controller("loginCtrl", ['$scope', '$http', '$cookies', function($scope, $http, $cookies) {
	$scope.errorMsg = '';
	$scope.login = function () {
		$http.post('/api/login', $scope.log)
			.then(function (res) {
				console.log(res.data.message);
				if (!res.data.success) {
					if (res.data.reason == 1) { // User not found
						$scope.errorMsg = 'L\'adresse e-mail fournit ne correspond a aucun compte.';
					} else if (res.data.reason == 2) { // Wrong password
						$scope.errorMsg = 'Le mot de passe fournit ne correspond pas.';
					} else if (res.data.reason == 3) { // Account not validated
						$scope.errorMsg = 'Le compte n\'a pas été validé. Merci de suivre le lien de validation dans le mail qui vous a été envoyé.';
					}
				} else {
					var expire = new Date(res.data.expire * 1000);

					$cookies.putObject('session', res.data, {expires: expire});
					window.location.href = '/home';
				}
			})
	};
}])

.controller("logoutCtrl", ['$rootScope', '$http', '$cookies', function($rootScope, $http, $cookies) {
	var token = $rootScope.session.token;
	$http.post('/api/logout', {'token': token})
		.then(function (res) {
			setTimeout(function () {window.location.href = "/"}, 1000);
			console.log(res.data.message);
		})
	$cookies.remove('session');
}])

.controller("homeCtrl", ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
	if ($rootScope.session.token === '0') {
		window.location.href = '/';
	}
	$scope.sessionID = $rootScope.session.token;
}])

.controller("profilEditCtrl", ['$scope', '$http', function($scope, $http) {

    $scope.nbDpt = null;
    $scope.getCities = function () {
        $http.get('/api/citydb/' + $scope.user.dptNb)
        .then(function(data) {
            $scope.cities = data.data;
        })
    };
    $scope.getPCode = function () {
        $http.get('/api/citydb/'+ $scope.user.dptNb + '/' + $scope.user.city)
        .then(function(data) {
            $scope.pcodes = data.data;
        })
    };
    $http.get('/api/citydb/dpts')
    .then(function(data) {
        $scope.dpts = data.data;
    })

}])

//-- Directives --//
.directive("profilEdit", function () {
    return {
		restrict: 'EA',
		replace: true,
        templateUrl: '/views/profil-edit.htm'
    };
})

//-- Routes --//
.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider
	.when("/",{
		templateUrl: "/views/index.htm"
	})
	.when("/error",{
		templateUrl: "/views/error.htm"
	})
	.when("/register", {
		templateUrl: "/views/register.htm",
		controller: "registerCtrl"
	})
	.when("/register/confirm-:data", {
		templateUrl: "/views/validate/register-confirm.htm",
		controller: "registerConfirmCtrl"
	})
	.when("/mail/:action/:data", {
		templateUrl: "/views/mail-validate.htm",
		controller: "mailValidateCtrl"
	})
	.when("/login", {
		templateUrl: "/views/login.htm",
		controller: "loginCtrl"
	})
	.when("/logout", {
		templateUrl: "/views/logout.htm",
		controller: "logoutCtrl"
	})
	.when("/home", {
		templateUrl: "/views/home.htm",
		controller: "homeCtrl"
	})
	.otherwise("/",{
		templateUrl: "/views/index.htm"
	})

}]);
