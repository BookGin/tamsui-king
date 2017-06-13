ActionCable.startDebugging()
window.App = {}
window.App.cable = ActionCable.createConsumer("ws://localhost:12345/cable")
window.App.wsChannel = window.App.cable.subscriptions.create({channel: "WsChannel", uuid: randomInt()}, {
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
    debug("Receive data: " + JSON.stringify(data));
    if (data.action === "bomb_positions")
      this.updateBombPositions(data);
    else if (data.action === "bomb_explosion")
      this.bombExplode(data);
    else if (data.action === "die")
      this.die(data);
    else if (data.action === "player_positions")
      this.updatePlayerPositions(data);
  },

  // Custom methods

  // client -> server
  playerMove: function(playerName, latLngPosition) {
    this.perform("playerMove", { player: playerName, position: latLngPosition, nonce: randomInt()});
  }

  plantBomb: function(playerName, latLngPosition) {
    this.perform("plantBomb", { player: playerName, position: latLngPosition, nonce: randomInt()});
  }

  // server -> client
  updateBombPositions: function(data) {
    for (let bombPosition of data.positions) {
      // TODO
    }
  }

  bombExplode: function(data) {
    let bombPosition = data.position;
    let radius = data.radius;
    // TODO
  }

  die: function(data) {
    let playerName = data.player;
    // TODO
  }

  updatePlayerPositions: function(data) {
    for (let playerPosition of data.positions) {
      // TODO
    }
  }
});

function randomInt() {
  let max = 2147483647;
  let max = 0;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
