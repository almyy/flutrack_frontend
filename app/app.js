'use strict';

angular.module('flutrack', [
        'ngRoute',
        'rzModule',
        'flutrack.services',
        'flutrack.controllers'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
                templateUrl: '/Views/landingPage.html',
                controller: 'spreadCtrl as vm'
            })
            .when('/spread', {
                templateUrl: '/Views/influenzaSpread.html',
                controller: 'mapCtrl'
            })
            .otherwise({redirectTo: '/'});
    }]);
