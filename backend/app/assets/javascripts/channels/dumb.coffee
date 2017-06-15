App.dumb = App.cable.subscriptions.create "DumbChannel",
  connected: ->
    # Called when the subscription is ready for use on the server

  disconnected: ->
    # Called when the subscription has been terminated by the server

  received: (data) ->
    $('#dumb_room').append(data['message'])
    
  speak: (message) ->
    @perform 'speak', message: message



$(document).on 'keypress', '[data-behavior~=dumb_speaker]', (event) ->
  if event.keyCode is 13 # Return key
    App.dumb.speak(event.target.value)
    event.target.value = ""
    event.preventDefault()
  
