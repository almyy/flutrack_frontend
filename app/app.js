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
            .otherwise({redirectTo: '/'});
    }]);
