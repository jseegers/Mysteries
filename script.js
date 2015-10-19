var app = angular.module("app", ["leaflet-directive", "ui.bootstrap", 'perfect_scrollbar', 'ngAnimate']);

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
        defaults: {
            minZoom: 2,
            zoomControlPosition: 'bottomright'
        },
        center: {
            lat: 40.297801,
            lng: -42.479483,
            zoom: 2
        },
        tiles: {
            name: 'Mysteries',
            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
            type: 'xyz',
            options: {
                continuousWorld: false,
                noWrap: true,
                apikey: 'pk.eyJ1IjoianNlZWdlcnMiLCJhIjoiNDA1ZmUwYjQ0NjAwZDdmYTI5NDM1MDA5ZDM5MzI0NjcifQ.WADGr4OinJSeTALx7NTFQQ',
                mapid: 'jseegers.4a299e8d'
            }
        }

    });
    $scope.TitleArray = [];
    $scope.LocArray = [];
    $scope.AllBooks = {};
    $scope.geoPoints = {};
    $scope.daggerMarker;

    $http.get("books.json").success(function (data) {
        $scope.booksJson = data;
        checkBookStuff(data);
    });
    $http.get("Mysteries.json").success(function (data) {
        //makeTitleArray(data);
        addGeoJsonLayer(data);
    });


    function markerClick() {
        console.log("hi")
    }



    function checkBookStuff(data) {
        for (var i = 0; i < data.length; i++) {
            //console.log(data[i].Location)
        }
    }
    $scope.cleanUpNames = function (name) {
        var cleanedName = name.replace(" ", "");
        if (cleanedName == "NewYork City"){
         cleanedName = "NewYorkCity";
        }
        return cleanedName;
    }

    function getRadius(name) {
        var checkArray = $scope.getindBooksArray(name)
        return Math.sqrt((60 * checkArray.length) / Math.PI);
    }

    $scope.locationHighlight = function (name) {
        var cleanedName = name.replace(" ", "");
        if (name === "New York City") {
            cleanedName = "NewYorkCity"
        }
        resetColors();
        var latLng = {};
        leafletData.getMap().then(function (map) {
            $scope.geoPoints.eachLayer(function (layer) {
                if (layer.feature.properties.Name == name) {
                    layer.setStyle({
                        fillColor: "#000",
                        color: "red",
                        weight: 2
                    })
                    latLng = layer.getLatLng();
                    $scope.daggerMarker = L.marker(layer.getLatLng(), {
                        icon: daggerIcon
                    }).addTo(map);
                }

            });
        });
        leafletData.getMap().then(function (map) {
            map.setView(latLng, 4, {
                animate: true
            })
        });
        setTimeout(function () {
            $scope.$apply(function () {
                $('.sidebar').animate({
                    scrollTop: $('#' + cleanedName).offset().top - $('.sidebar').offset().top + $('.sidebar').scrollTop()
                })
                $('#' + cleanedName).children('.panel-heading').css("background-color", "black")
            });
        }, 1000);

    }
    $scope.getindBooksArray = function (location) {
        var checkArray = [];
        for (var i = 0; i < $scope.booksJson.length; i++) {
            var split = $scope.booksJson[i].Location.split("|");
            if (split.length > 1) {
                for (var j = 0; j < split.length; j++) {
                    if (split[j].trim() == location) {
                        checkArray.push({
                            "title": $scope.booksJson[i].Title,
                            "author": $scope.booksJson[i].Author,
                            "year": $scope.booksJson[i].Year
                        })
                    }
                }
            }
            if ($scope.booksJson[i].Location == location) {
                checkArray.push({
                    "title": $scope.booksJson[i].Title,
                    "author": $scope.booksJson[i].Author,
                    "year": $scope.booksJson[i].Year
                })
            }
        }
        $scope.AllBooks[location] = checkArray;
        return checkArray;
    }

    function resetColors() {
        for (var i = 0; i < $scope.LocArray.length; i++) {
            var cleanedName = $scope.LocArray[i]["name"].replace(" ", "");
            if ($scope.LocArray[i]["name"] === "New York City") {
                cleanedName = "NewYorkCity"
            }
            $('#' + cleanedName).children('.panel-heading').css("background-color", "#333")
        }
        $scope.geoPoints.eachLayer(function (layer) {
            layer.setStyle({
                fillColor: "red",
                color: "#000",
                weight: 1
            })
        });
        leafletData.getMap().then(function (map) {
            map.removeLayer($scope.daggerMarker)
        })
    }


    function onEachFeature(feature, layer) {
        /*        if (feature.properties && feature.properties.Name) {
                    layer.bindPopup(feature.properties.Name);
                }*/

        setTimeout(function () {
            $scope.$apply(function () {
                $scope.LocArray.push({
                    "name": feature.properties.Name,
                    "open": false,
                    "number": $scope.AllBooks[feature.properties.Name].length
                })
            })
        }, 100)

        layer.on({
            click: function () {
                resetColors();

                for (var i = 0; i < $scope.LocArray.length; i++) {
                    if ($scope.LocArray[i]["name"] == feature.properties.Name) {
                        $scope.LocArray[i]["open"] = true;
                    }
                }
                layer.setStyle({
                    fillColor: "#000",
                    color: "red",
                    weight: 2
                })
                leafletData.getMap().then(function (map) {
                    map.setView(layer.getLatLng(), 4, {
                        animate: true
                    })
                    $scope.daggerMarker = L.marker(layer.getLatLng(), {
                        icon: daggerIcon
                    }).addTo(map);

                })
                var cleanedName = feature.properties.Name.replace(" ", "");
                if (feature.properties.Name === "New York City") {
                    cleanedName = "NewYorkCity"
                }
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.Location = feature.properties.Name;
                        $scope.LocArray
                        $('.sidebar').animate({
                            scrollTop: $('#' + cleanedName).offset().top - $('.sidebar').offset().top + $('.sidebar').scrollTop()
                        })
                        $('#' + cleanedName).children('.panel-heading').css("background-color", "black")
                    });
                }, 1000);
            }
        });

    }
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "red",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6
    };
    var daggerIcon = L.icon({
        iconUrl: 'dagger_icon.svg',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    })
    var myIcon = L.divIcon({
        className: 'my-dagger-icon'
    });

    function addGeoJsonLayer(data) {
        leafletData.getMap().then(function (map) {
            $scope.geoPoints = L.geoJson(data, {
                onEachFeature: onEachFeature,
                pointToLayer: function (feature, latlng) {
                    //return L.marker(latlng, {icon: daggerIcon}).addTo(map);
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            }).addTo(map)
            $scope.geoPoints.eachLayer(function (layer) {
                layer.setRadius(getRadius(layer.feature.properties.Name))
            });
            /*            geojson = L.geoJson(data, {
                            onEachFeature: onEachFeature,
                            pointToLayer: function (feature, latlng) {
                                return L.marker(latlng, {
                                    icon: myIcon
                                })
                            }
                        }).addTo(map);*/
        });


    }
}]);

app.controller("ModalController", ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

    $scope.animationsEnabled = true;

    $scope.open = function () {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'methodology.html',
            controller: 'ModalInstanceCtrl'
        });

    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

}]);

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {


    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
