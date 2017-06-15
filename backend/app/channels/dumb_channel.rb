class DumbChannel < ApplicationCable::Channel
  def subscribed
    stream_from "dumb_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def speak(data)
    m = Dumb.create!(content: data["message"])
    # Do sth here. In this channel, broadcast back
    ActionCable.server.broadcast 'dumb_channel', message: render_dumb_div(m)
  end

  private
  def render_dumb_div(m)
    ApplicationController.renderer.render(
      partial: "dumbs/dumb",
      locals: {dumb: m})
  end
end
