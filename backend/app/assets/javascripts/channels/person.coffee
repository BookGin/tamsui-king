App.person = App.cable.subscriptions.create "PersonChannel",
  connected: ->
    # Called when the subscription is ready for use on the server

  disconnected: ->
    # Called when the subscription has been terminated by the server

  received: (data) ->
    alert data["message"]      
    # TODO: really re-render player according to her new position
    
  send_position: (lat, lng, person_id) ->        
    @perform 'send_position', lat: lat, lng: lng, person_id: person_id 

