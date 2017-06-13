var ws = new WebsocketClient("ws://localhost:18763/");
var map;
var player;
var directionsService;
var startingPosition = {"lat":25.019422934847636, "lng":121.5412656654205};
var playerSpeed = 100; // meter
var bomb_url = "https://truth.bahamut.com.tw/s01/201006/ecf8480193018fe7494530cb1559d0f3.JPG";

var bomb_list = {};
var player_list = {};
var explosion_list = {};

// Reference: https://stackoverflow.com/a/32784450
function point2LatLng(point) {
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
  var scale = Math.pow(2, map.getZoom());
  var worldPoint = new google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y);
  return map.getProjection().fromPointToLatLng(worldPoint);
}

function playerDie(name){ // remove player from the map
  player_list[name].setMap(null);
}

function setBomb(point, name) { // set bomb on the map
  var icon = {
    url: bomb_url, // url
    scaledSize: new google.maps.Size(30, 30), // scaled size
    };
  bomb_list[name] = new google.maps.Marker({ 
    map: map,
    position: point,
    icon: icon,
  });
  return
}

function explosion(name) { // bomb explosion
  var rad = 10; // convert to meters if in miles
  var bomb = bomb_list[name];
  var point = bomb.getPosition();
  explosion_list[name] = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          center: point,
          radius: rad*2.7,
  });
  bomb_list[name].setMap(null);
  return
}

document.documentElement.addEventListener('keydown', function(e) {
  if (e.keyCode === 81) { // press Q
    setBomb(player.getPosition(), player.getTitle());
  }
  if (e.keyCode === 69){ // press E
    explosion(player.getTitle());
  }
  if (e.keyCode === 65 || e.keyCode === 87 || e.keyCode === 83 || e.keyCode === 68){
    if(e.keyCode === 65){
      var x_move = -0.0005; var y_move = 0;
    }
    else if(e.keyCode === 87){
      var x_move = 0; var y_move = 0.0005;
    }
    else if(e.keyCode === 83){
      var x_move = 0; var y_move = -0.0005;
    }
    else{
      var x_move = 0.0005; var y_move = 0;
    }
    var position = player.getPosition();
    var newPosition = {"lat": position.lat() + y_move, "lng": position.lng() + x_move};
    debug("move to" + JSON.stringify(newPosition));

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
            newPosition = nextPos; // player can't leave streets.
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
  }
});

function setPlayer(point, name) { // set palyer on the map
  player_list[name] = new google.maps.Marker({
		map: map,
		position: point,
		title: name,
		icon: "http://maps.google.com/mapfiles/ms/micons/woman.png",
	});
}


function generatePolyline(route) {
  var polyline = new google.maps.Polyline({
    path: [player.getPosition()],
    strokeColor: '#FF0000',
    strokeWeight: 3
  });
  var totalDistance = 0;
  for (let leg of route.legs) {
    for (let step of leg.steps) {
      if (totalDistance + step.distance.value >= playerSpeed) {
        let ratio = (playerSpeed - totalDistance) / step.distance.value;
        let interpolatingPosition = google.maps.geometry.spherical.interpolate(step.start_location, step.end_location, ratio)
        polyline.getPath().push(interpolatingPosition);
        return polyline;
      } 
      polyline.getPath().push(step.end_location);
      totalDistance += step.distance.value;
    }
  }
  return polyline;
}

function movePlayer(directionsServiceResponse, status) {
  if (status != google.maps.DirectionsStatus.OK) {
    window.alert('Directions request failed due to ' + status);
    return;
  }
  var route = directionsServiceResponse.routes[0];
  var polyline = generatePolyline(route);
  polyline.setMap(map);
  // polyline.getPath() will return a MVCArray
  var nextPosition = polyline.getPath().getAt(polyline.getPath().length - 1);
  player.setPosition(nextPosition);
}

// Reference: https://stackoverflow.com/questions/16180104/get-a-polyline-from-google-maps-directions-v3
document.documentElement.addEventListener('click', function(mouse) {
  var clientPoint = {x: mouse.clientX, y:mouse.clientY};
	var newPosition = point2LatLng(clientPoint);
  debug("Click on" + JSON.stringify(newPosition));

  directionsService.route({
    origin: player.getPosition(),
    destination: newPosition,
    travelMode: google.maps.TravelMode.WALKING
  }, movePlayer);

  //setPlayer(newPosition, 'test');
});

function debug(msg){
  document.getElementById('debug-block').innerHTML += msg + '<br/>';
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

