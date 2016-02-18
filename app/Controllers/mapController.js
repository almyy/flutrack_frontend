'use strict';

angular.module('flutrack.controllers', ['flutrack.services'])
    .controller('mapCtrl', function ($scope, HttpService) {
        var data = [];
        HttpService.get('/api', '').then(function (res) {
            for (var tweet in res.data) {
                data.push(new google.maps.LatLng(res.data[tweet].latitude, res.data[tweet].longitude));
            }
            console.log(data.length);
            var mapOptions = {
                zoom: 3,
                center: new google.maps.LatLng(40, -98),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById('map'), mapOptions);
            var heatMap = new google.maps.visualization.HeatmapLayer({
                data: data,
                map: map,
                radius: 15
            });
            heatMap.set('opacity', 1);
            $scope.map = map;
        }, function (error) {
            console.log(error);
        });
    });