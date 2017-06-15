ActionCable.startDebugging()

var WebsocketClient = WebsocketClient || {};
WebsocketClient = function(websocketHostname) {
  this.randomInt = function() {
    let max = 2147483647;
    let min = 0;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  this.cable = ActionCable.createConsumer(websocketHostname)
  this.bomb = this.cable.subscriptions.create({channel: "BombChannel", uuid: this.randomInt()}, {
    // ActionCable callbacks
    connected: () => debug("websocket start " + String(this.identifier)),
    disconnected: () => debug("websocket closed " + String(this.identifier)),
    rejected: () => debug("websocket is rejected " + String(this.identifier)),
    received: function(data) {
      debug("Receive data: " + JSON.stringify(data));
      if (data.action === "planted")
        this.updateBombPositions(data);
      else if (data.action === "explosion")
        this.bombExplode(data);
    },
    plant: function(latLngPosition, radius, lasting) {
      this.perform("set_bomb", { position: latLngPosition, radius: radius, lasting: lasting });
    }
  });

  this.person = this.cable.subscriptions.create({channel: "PersonChannel", uuid: this.randomInt()}, {
    // ActionCable callbacks
    connected: () => debug("websocket start " + String(this.identifier)),
    disconnected: () => debug("websocket closed " + String(this.identifier)),
    rejected: () => debug("websocket is rejected " + String(this.identifier)),
    received: function(data) {
      debug("Receive data: " + JSON.stringify(data));
      if (data.action === "died")
        this.die(data);
      else if (data.action === "positioned")
        this.updatePlayerPositions(data);
    },
    move: function(latLngPosition) {
      this.perform("send_position", { position: latLngPosition });
    }  
  
  });
  

  this.updateBombPositions = {};
  this.bombExplode = {};
  this.updatePlayerPositions = {};
  this.die = {};
    
};
