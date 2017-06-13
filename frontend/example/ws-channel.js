ActionCable.startDebugging()
window.App = {}
window.App.cable = ActionCable.createConsumer("ws://localhost:12345/cable")
window.App.clockChannel = window.App.cable.subscriptions.create({channel: "WsChannel", uuid: randomInt()}, {
  // ActionCable callbacks
  connected: function() {
    debug("websocket start " + String(this.identifier));
  },
  disconnected: function() {
    debug("websocket closed " + String(this.identifier));
  },
  rejected: function() {
    debug("websocket is rejected");
  },
  received: function(data) {
    debug("Receive data: " + String(data));
    this.tick(data)
  },
  // Custom methods

  // client -> server
  playerMove: function(playerName, latLngPosition) {
    this.perform("playerMove", { player: playerName, position: latLngPosition, nonce: randomInt()});
  }

  plantBomb: function(playerName, latLngPosition) {
    this.perform("plantBomb", { player: playerName, position: latLngPosition, nonce: randomInt()});
  }
  // TODO: server -> client
});

function randomInt() {
  let max = 2147483647;
  let max = 0;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
