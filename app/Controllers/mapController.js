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

            var map = new google.maps.Map(document.getElementById('map'), mapOptions);
            var heatMap = new google.maps.visualization.HeatmapLayer({
                data: data,
                map: map,
                radius: 15,
                gradient: gradient
            });
            var style = [
                {
                    featureType: 'all',
                    elementType: 'all',
                    stylers: [ // styling the map
                        { saturation: -100 },
                        { lightness: 0 },
                        { gamma: 0.90 }
                    ]
                },
                {
                    featureType: 'water',
                    elementType: 'geometry.fill',
                    stylers: [
                        { color: '#383838' }
                    ]
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text',
                    stylers: [
                        { color: '#ffffff' }
                    ]
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [
                        { color: '#383838' }
                    ]
                }
            ];

            var styledMapType = new google.maps.StyledMapType(style, { map: map, name:'Styled Map'});
            map.mapTypes.set('map-style', styledMapType);
            map.setMapTypeId('map-style');

            heatMap.set('opacity', 1);
            $scope.map = map;
        }, function (error) {
            console.log(error);
        });
    });