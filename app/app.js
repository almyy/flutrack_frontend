'use strict';

angular.module('flutrack', [
        'ngRoute',
        'flutrack.services',
        'flutrack.controllers'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '/Views/landingPage.html',
            controller: 'mapCtrl'
        });
        $routeProvider.when('/spread', {
            templateUrl: '/Views/influenzaSpread.html',
            controller: 'spreadCtrl'
        });

        $routeProvider.otherwise({redirectTo: '/'});
    }]);
