App.bomb = App.cable.subscriptions.create("BombChannel", {
  connected() {},
  disconnected() {},
  received: function(data) {
    debug("Receive data: " + JSON.stringify(data));
    if (data.action === "planted")
      updateBombPositions(data);
    else if (data.action === "explosion")
      bombExplode(data);
  },
  plant: function(latLngPosition, radius, lasting) {
    this.perform("set_bomb", { position: latLngPosition, radius: radius, lasting: lasting });
  }
}); 
