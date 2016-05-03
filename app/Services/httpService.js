/**
 * Created by Martin on 12.01.2016.
 */
angular.module('flutrack.services', [])

    .factory('HttpService', ['$http', function($http) {

        return {
            get: function (url, query) {
                return $http.get(url);
            }
        }
    }]);