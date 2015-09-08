var app = angular.module("app", ["angular-mapbox"]);

app.controller('MapController', function ($scope, $timeout, mapboxService) {
    mapboxService.init({
        accessToken: 'pk.eyJ1IjoianNlZWdlcnMiLCJhIjoiNDA1ZmUwYjQ0NjAwZDdmYTI5NDM1MDA5ZDM5MzI0NjcifQ.WADGr4OinJSeTALx7NTFQQ'
    })
    $timeout(function () {
        var map = mapboxService.getMapInstances()[0];
        //mapboxService.fitMapToMarkers(map);
    }, 100);
    $scope.geojsonMarkerOptions = {
        radius: 10,
        fillColor: "red",
        borderColor: "#000",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5
    };
    $scope.onEachFeature = function (feature, layer) {
        // does this feature have a property named popupContent?
        console.log(feature)
    }
    $scope.options = {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, $scope.geojsonMarkerOptions);
        }
    }

});