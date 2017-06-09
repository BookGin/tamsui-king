// Demo: http://jsfiddle.net/4mtyu/2655/

// Reference: https://stackoverflow.com/a/32784450
function point2LatLng(point, map) {
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
  var scale = Math.pow(2, map.getZoom());
  var worldPoint = new google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y);
  return map.getProjection().fromPointToLatLng(worldPoint);
}

document.documentElement.addEventListener('click', function(mouse) {
  var client_point = {x: mouse.clientX, y:mouse.clientY};
  // var map_lat_lng = point2LatLng(client_point, google_map_object);
  log("Click " + JSON.stringify(client_point));
});

function log(msg){
  document.getElementById('debug-block').innerHTML += msg + '<br />';
}
