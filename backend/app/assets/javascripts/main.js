// var ws = new WebsocketClient("ws://localhost:28080/cable");
var map;
var myUUID;
var playerSelfId;
var player;
var directionsService;
var startingPosition = {"lat":25.019422934847636, "lng":121.5412656654205};
function showPosition(position) {
	var newPos = {"lat": position.coords.latitude, "lng": position.coords.longitude}
  directionsService.route({
    origin: player.getPosition(),
    destination: newPos,
    travelMode: google.maps.TravelMode.WALKING
  }, movePlayer);
}
var playerSpeed = 100; // meter
var bomb_url = "https://i.imgur.com/zBYNNeg.png"

var bomb_list = {};
var player_list = {};

// Reference: https://stackoverflow.com/a/32784450
function point2LatLng(point) {
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
  var scale = Math.pow(2, map.getZoom());
  var worldPoint = new google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y);
  return map.getProjection().fromPointToLatLng(worldPoint);
}

document.documentElement.addEventListener('keydown', function(e) {
  if (e.keyCode === 81) { // press Q
    // bomb.pos, radius (int lat lnt), timer (second)
    App.bomb.plant(player.getPosition(), 0.002, 5); 
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
    }, movePlayer);
  }
});

updateBombPositions = function(data) { // set bomb on the map
  bomb = JSON.parse(data.bomb);
  if (!(bomb.id in bomb_list)) {
    bomb_list[bomb.id] = new google.maps.Marker({
      map: map,
      label: {
        color: 'Red',
        fontWeight: 'bold',
        fontSize: '18',
        text: String(bomb.person_id),
      },
      scaledSize: new google.maps.Size(30, 30), // scaled size
      icon: bomb_url,
    });
  }
  console.log(bomb)  
  // debug(JSON.stringify(bomb_list));
  debug(bomb.id);
  console.log(bomb.position);
  bomb_list[bomb.id].setPosition(eachToFloat(bomb.position));
  
}

bombExplode = function(data) { // bomb explosion
  bomb = JSON.parse(data.bomb)
  if (!(bomb.id in bomb_list))
    debug(bomb.id + " is not in bomb list! " + JSON.stringify(bomb_list));
  var rad = bomb.radius; // convert to meters if in miles
  var explosionCircle  = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          center: bomb_list[bomb.id].getPosition(),
          radius: rad * 10000 * 10,
  });

  // remove this explosion circle after 3000ms
  setTimeout( () => explosionCircle.setMap(null), 3000);
  bomb_list[bomb.id].setMap(null);
  delete bomb_list[bomb.id];
}

updatePlayerPositions = function(data) {
  person = JSON.parse(data.person)
  if (person.id === playerSelfId)
    return;
  if (!(person.id in player_list)) {
    player_list[person.id] = new google.maps.Marker({
      map: map,
      label: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: '18',
        text: String(person.id),
      },
      icon: "http://maps.google.com/mapfiles/ms/micons/man.png",
    });
  }
  player_list[person.id].setPosition(eachToFloat(person.position));
}

die = function(data) {
  person = JSON.parse(data.person)
  console.log("person" + person.id + "die")
  if (person.id === playerSelfId) {
    window.alert('You died!');
    return;
  }
  if (!(person.id in player_list))
    debug(person.id + " is not in player list! " + JSON.stringify(player_list));
  player_list[person.id].setMap(null);
  delete player_list[person.id];
}

initPlayerID = function(data) {
  if(data.nonce == myUUID) {
    person = JSON.parse(data.person);
    playerSelfId = person.id;
  }
}

function generatePolyline(route) {
  var polyline = new google.maps.Polyline({
    path: [player.getPosition()],
    strokeColor: '#FFFFFF',
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

  if (playerSelfId === undefined) {
    myUUID = randomUUID();
    App.person.init(myUUID);
  }

  var route = directionsServiceResponse.routes[0];
  var polyline = generatePolyline(route);
  polyline.setMap(map);
  // polyline.getPath() will return a MVCArray
  var nextPosition = polyline.getPath().getAt(polyline.getPath().length - 1);
  player.setPosition(nextPosition);
	map.panTo(nextPosition);
  App.person.move(nextPosition);
  // remove the polyline after 1000 ms
  setTimeout( () => polyline.setMap(null), 1000);
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
});

function debug(msg){
  //document.getElementById('debug-block').innerHTML += msg + '<br/>';
}

eachToFloat = function(pos) {
  floatLat = parseFloat(pos.lat);
  floatLng = parseFloat(pos.lng);
  return {lat: floatLat, lng: floatLng};
}


randomUUID = function() {
  var d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}		 

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: startingPosition,
		//scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: false,
    zoom: 18,
		mapTypeId: 'hybrid', 
  });

  directionsService = new google.maps.DirectionsService;

  player = new google.maps.Marker({
    map: map,
    position: startingPosition,
    label: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: '22',
      text: 'Player',
    },
    icon: "http://maps.google.com/mapfiles/ms/micons/woman.png",
  });
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(){});
		setInterval(function(){navigator.geolocation.getCurrentPosition(showPosition);}, 1200);
	}
}
