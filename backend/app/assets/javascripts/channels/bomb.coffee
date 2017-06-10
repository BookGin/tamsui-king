App.bomb = App.cable.subscriptions.create "BombChannel",
  connected: ->
    # Called when the subscription is ready for use on the server

  disconnected: ->
    # Called when the subscription has been terminated by the server

  received: (data) ->
    if data["message"] == "Placed"      
      alert("Bomb placed: #{data['bomb']}")
    else
      alert("Bomb bombed: #{data['bomb']}")
    # TODO: really place or bomb somewhere

  set_bomb: (lat, lng, person_id, time_to_bomb, radius) ->
    @perform 'set_bomb', lat: lat, lng: lng, person_id: person_id, time_to_bomb: time_to_bomb, radius: radius
    
