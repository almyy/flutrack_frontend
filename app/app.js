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
                controller: 'mapCtrl'
            })
            .when('/spread', {
                templateUrl: '/Views/influenzaSpread.html',
                controller: 'spreadCtrl'
            })
            .otherwise({redirectTo: '/'});
    }]);
