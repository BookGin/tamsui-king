// Python websocket server: https://websockets.readthedocs.io/en/stable/intro.html#basic-example
var WebsocketClient = WebsocketClient || {};
WebsocketClient = function(websocketHost) {
  this.ws = new WebSocket(websocketHost);
  this.ws.onopen = () => debug("websocket opened");
  this.ws.onclose = () => debug("websocket closed");

  this.send = (sendData) => this.ws.send(sendData);

  this.ws.onmessage = function(response) {
    debug("websocket recv:" + String(response.data));
  };
};
