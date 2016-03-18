'use strict';

angular.module('flutrack.controllers', ['flutrack.services', 'rzModule'])
    .controller('spreadCtrl', function ($scope, HttpService) {
        $scope.daySlider = 0;
        var map;
        var mapOptions = {
            streetViewControl: false,
            scrollwheel: false,
            mapTypeControl: false,
            zoom: 4,
            center: new google.maps.LatLng(40, -98),
            mapTypeId: google.maps.MapTypeId.SATELLITE
        };
        var gradient = [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
        ];
        var style = [
            {
                featureType: 'all',
                elementType: 'all',
                stylers: [ // styling the map
                    {saturation: -100},
                    {lightness: 0},
                    {gamma: 0.90}
                ]
            },
            {
                featureType: 'water',
                elementType: 'geometry.fill',
                stylers: [
                    {color: '#383838'}
                ]
            },
            {
                featureType: 'water',
                elementType: 'labels.text',
                stylers: [
                    {color: '#ffffff'}
                ]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [
                    {color: '#383838'}
                ]
            }
        ];
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        var styledMapType = new google.maps.StyledMapType(style, {map: map, name: 'Styled Map'});
        map.mapTypes.set('map-style', styledMapType);
        map.setMapTypeId('map-style');
        var heatmap = new HeatmapOverlay(map,
            {
                // radius should be small ONLY if scaleRadius is true (or small radius is intended)
                "radius": 2,
                "maxOpacity": 1,
                // scales the radius based on map zoom
                "scaleRadius": true,
                // if set to false the heatmap uses the global maximum for colorization
                // if activated: uses the data maximum within the current map boundaries
                //   (there will always be a red spot with useLocalExtremas true)
                "useLocalExtrema": false,
                // which field name in your data represents the latitude - default "lat"
                latField: 'lat',
                // which field name in your data represents the longitude - default "lng"
                lngField: 'lng',
                // which field name in your data represents the data value - default "value"
                valueField: 'count'
            }
        );
        HttpService.get('/api/prediction', 'index=14&day=' + $scope.daySlider).then(function (res) {
            var data = [];
            for (var i = 0; i < res.data.length; i++) {
                for (var j = 0; j < res.data[i].length; j++) {
                    data.push({
                        lat: res.data[i][j].location.lat,
                        lng: res.data[i][j].location.lng,
                        count: res.data[i][j].infectious
                    });
                }
            }
            //var heatMap = new google.maps.visualization.HeatmapLayer({
            //    data: data,
            //    map: map,
            //    radius: 30,
            //    gradient: gradient
            //});
            //
            //
            //
            //$scope.map = map

            var testData = {
                max: 60000,
                data: data
            };
            heatmap.setData(testData);

        }, function (error) {
            console.log('Got an error from the API:' + error.message);
        });
        $scope.$on('slideEnded', function () {
            HttpService.get('/api/prediction', 'index=14&day=' + $scope.daySlider).then(function (res) {
                var data = [];
                for (var i = 0; i < res.data.length; i++) {
                    for (var j = 0; j < res.data[i].length; j++) {
                        data.push({
                            lat: res.data[i][j].location.lat,
                            lng: res.data[i][j].location.lng,
                            count: res.data[i][j].infectious
                        });
                    }
                }
                //var heatMap = new google.maps.visualization.HeatmapLayer({
                //    data: data,
                //    map: map,
                //    radius: 30,
                //    gradient: gradient
                //});
                //
                //
                //
                //$scope.map = map;

                var testData = {
                    max: 100000,
                    data: data
                };
                heatmap.setData(testData);
            }, function (err) {
                console.log('Got an error from the API:' + err.message);
            });
        });
    });