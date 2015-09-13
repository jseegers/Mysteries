var app = angular.module("app", ["leaflet-directive", "ui.bootstrap"]);

/*app.controller('MapController', function ($scope, $timeout, mapboxService) {*/
app.controller("MapController", ['$scope', '$http', 'leafletData', function ($scope, $http, leafletData) {
    /*mapboxService.init({
        accessToken: 'pk.eyJ1IjoianNlZWdlcnMiLCJhIjoiNDA1ZmUwYjQ0NjAwZDdmYTI5NDM1MDA5ZDM5MzI0NjcifQ.WADGr4OinJSeTALx7NTFQQ'
    })
    $timeout(function () {
        var map = mapboxService.getMapInstances()[0];
        //mapboxService.fitMapToMarkers(map);
    }, 100);*/
    angular.extend($scope, {
        center: {
            lat: 40.297801,
            lng: -42.479483,
            zoom: 3
        },
        tiles: {
            name: 'Mysteries',
            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
            type: 'xyz',
            options: {
                apikey: 'pk.eyJ1IjoianNlZWdlcnMiLCJhIjoiNDA1ZmUwYjQ0NjAwZDdmYTI5NDM1MDA5ZDM5MzI0NjcifQ.WADGr4OinJSeTALx7NTFQQ',
                mapid: 'jseegers.4a299e8d'
            }
        }

    });
    $scope.LocArray = [];
    $http.get("Mysteries.json").success(function (data) {
        makeLocArray(data);
        addGeoJsonLayer(data);
    });

    $http.get("books.json").success(function (data) {
        var booksJson = data;
        checkBookStuff(data);
    });

    function makeLocArray(data) {
        setTimeout(function () {
            $scope.$apply(function () {
                for (var i = 0; i < data.features.length; i++) {
                    $scope.LocArray.push(data.features[i].properties.Name)
                }
            });
        }, 2000);
        console.log("I happened!")
    }

    function markerClick() {
        console.log(this)
    }

    function checkBookStuff(data) {
        for (var i = 0; i < data.length; i++) {
            //console.log(data[i].Location)
        }
    }

    function onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.Name) {
            layer.bindPopup(feature.properties.Name);
        }
    }
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "red",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6
    };
    var myIcon = L.divIcon({
        className: 'trigger'
    });


    function addGeoJsonLayer(data) {
        leafletData.getMap().then(function (map) {
            L.geoJson(data, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            }).addTo(map)
            L.geoJson(data, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {
                        icon: myIcon
                    })
                }
            }).addTo(map).on('click', markerClick);;
        });


    }
}]);