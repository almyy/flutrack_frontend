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
        $routeProvider.otherwise({redirectTo: '/'});
    }]);
