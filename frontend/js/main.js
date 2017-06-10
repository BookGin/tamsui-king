var map;
var player;
var directionsService;
var startingPosition = {"lat":25.019422934847636, "lng":121.5412656654205};

// Reference: https://stackoverflow.com/a/32784450
function point2LatLng(point) {
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
  var scale = Math.pow(2, map.getZoom());
  var worldPoint = new google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y);
  return map.getProjection().fromPointToLatLng(worldPoint);
}

// Reference: https://stackoverflow.com/questions/16180104/get-a-polyline-from-google-maps-directions-v3
document.documentElement.addEventListener('click', function(mouse) {
  var clientPoint = {x: mouse.clientX, y:mouse.clientY};
  //debug("Click " + JSON.stringify(clientPoint));
	var newPosition = point2LatLng(clientPoint);
  debug("Click on" + JSON.stringify(newPosition));

  directionsService.route({
    origin: player.getPosition(),
    destination: newPosition,
    travelMode: google.maps.TravelMode.WALKING
  }, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      var polyline = new google.maps.Polyline({
        path: [],
        strokeColor: '#FF0000',
        strokeWeight: 3
      });

      var legs = response.routes[0].legs;
      for (let leg of legs) {
        for (let step of leg.steps) {
          for (let nextPos of step.path) {
            polyline.getPath().push(nextPos);
            new google.maps.Marker({
              map: map,
              position: nextPos,
            });
          }
        }
      }
      polyline.setMap(map);

      player.setPosition(newPosition);
      map.panTo(newPosition);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });

});

function debug(msg){
  document.getElementById('debug-block').innerHTML += msg + '<br />';
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: startingPosition,
    zoom: 18,
  });

  directionsService = new google.maps.DirectionsService;

	player = new google.maps.Marker({
		map: map,
		position: startingPosition,
		title: 'Hello World!',
		icon: "http://maps.google.com/mapfiles/ms/micons/woman.png",
	});
}
