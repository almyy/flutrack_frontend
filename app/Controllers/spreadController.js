'use strict';

angular.module('flutrack.controllers', ['flutrack.services'])
    .controller('spreadCtrl', function ($scope, $timeout, HttpService) {
        var vm = this;
        vm.sliderReady = false;
        var map;
        var mapOptions = {
            streetViewControl: false,
            scrollwheel: false,
            mapTypeControl: false,
            zoom: 4,
            center: new google.maps.LatLng(40, -98),
            mapTypeId: google.maps.MapTypeId.SATELLITE
        };
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
        google.maps.event.addDomListener(window, "resize", function () {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        });

        var styledMapType = new google.maps.StyledMapType(style, {map: map, name: 'Styled Map'});
        map.mapTypes.set('map-style', styledMapType);
        map.setMapTypeId('map-style');
        var predictionHeatmap = new HeatmapOverlay(map,
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
                valueField: 'count',
                gradient: {
                    '0.07': 'rgba(0, 255, 255, 0)',
                    '0.14': 'rgba(0, 255, 255, 1)',
                    '0.21': 'rgba(0, 191, 255, 1)',
                    '0.28': 'rgba(0, 127, 255, 1)',
                    '0.35': 'rgba(0, 63, 255, 1)',
                    '0.42': 'rgba(0, 0, 255, 1)',
                    '0.49': 'rgba(0, 0, 223, 1)',
                    '0.56': 'rgba(0, 0, 191, 1)',
                    '0.63': 'rgba(0, 0, 159, 1)',
                    '0.70': 'rgba(0, 0, 127, 1)',
                    '0.77': 'rgba(63, 0, 91, 1)',
                    '0.84': 'rgba(127, 0, 63, 1)',
                    '0.91': 'rgba(191, 0, 31, 1)',
                    '1': 'rgba(255, 0, 0, 1)'
                }
            }
        );
        var days = [];
        var tweets = [];

        HttpService.get('/api/prediction').then(function (res) {
            console.log(res);
            vm.isEpidemic = !res.data.is_dummy;
            HttpService.get('/api/tweets').then(function (res) {
                vm.trends = res.data;
                for(var i = 0; i < vm.trends[0].weeks.length; i++) {
                    var week = [];
                    for(var j = 0; j < vm.trends.length; j++) {
                        week.push({
                            lat: vm.trends[j].location.lat,
                            lng: vm.trends[j].location.lng,
                            count: vm.trends[j].weeks[i]
                        })
                    }
                    tweets.push(week);
                }
            }, function(err) {
                console.log("Got an error from the API: " + err.message);
            });
            for (var i = 0; i < res.data.forecast.length; i++) {
                var data = [];
                for (var j = 0; j < res.data.forecast[i].length; j++) {
                    data.push({
                        lat: res.data.forecast[i][j].location.lat,
                        lng: res.data.forecast[i][j].location.lng,
                        count: res.data.forecast[i][j].morbidity
                    });
                }
                days.push(data);
            }

            vm.updateHeatMap = function() {
                var predictionData = {
                    max: 100,
                    data: days[vm.predictionSlider.value]
                };
                console.log(predictionData);
                predictionHeatmap.setData(predictionData);
            };
            vm.predictionSlider = {
                value: 0,
                options: {
                    floor: 0,
                    ceil: 439,
                    onChange:vm.updateHeatMap
                }
            };
            vm.sliderReady = true;
            $scope.$broadcast('rzSliderForceRender');

        }, function (error) {
            console.log('Got an error from the API:' + error.message);
        });
        vm.bgColor = function(city) {
            if(vm.trends[city].epidemic) {
                return {'background-color': '#FF6149'}
            }
            else if(vm.trends[city].increasing) {
                return {'background-color': 'rgb(255,240,124)'}
            }
            else {
                return {'background-color': 'none'}
            }
        }
    });