ActionCable.startDebugging()

var WebsocketClient = WebsocketClient || {};
WebsocketClient = function(websocketHostname) {
  this.randomInt = function() {
    let max = 2147483647;
    let min = 0;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  this.cable = ActionCable.createConsumer(websocketHostname)
  this.wsChannel = this.cable.subscriptions.create({channel: "WsChannel", uuid: this.randomInt()}, {
    // ActionCable callbacks
    connected: () => debug("websocket start " + String(this.identifier)),
    disconnected: () => debug("websocket closed " + String(this.identifier)),
    rejected: () => debug("websocket is rejected " + String(this.identifier)),
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
    }
  });

  this.playerMove = function(playerName, latLngPosition) {
    this.perform("playerMove", { player: playerName, position: latLngPosition, nonce: this.randomInt()});
  };

  this.plantBomb = function(playerName, latLngPosition) {
    this.perform("plantBomb", { player: playerName, position: latLngPosition, nonce: this.randomInt()});
  };

  this.updateBombPositions = {};
  this.bombExplode = {};
  this.updatePlayerPositions = {};
  this.playerDie = {};
};
