var app = angular.module("app", ["leaflet-directive"]);

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

    $http.get("Mysteries.json").success(function (data) {
        addGeoJsonLayer(data);
    });

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
        className: 'my-div-icon'
    });

    function addGeoJsonLayer(data) {
        leafletData.getMap().then(function (map) {
            L.geoJson(data, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                },
                onEachFeature: onEachFeature
            }).addTo(map)
/*            L.geoJson(data, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {
                        icon: myIcon
                    });
                },
                onEachFeature: onEachFeature
            }).addTo(map);*/
        });
        

    }
}]);