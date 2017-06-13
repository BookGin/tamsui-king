App.person = App.cable.subscriptions.create("PersonChannel", {
  connected() {},
  disconnected() {},
  received: function(data) {
    debug("Receive data: " + JSON.stringify(data));
    if (data.action === "died")
      die(data);
    else if (data.action === "positioned")
      updatePlayerPositions(data);	
  },
  move: function(latLngPosition) {
    this.perform("send_position", { position: latLngPosition });
  }  
}); 
