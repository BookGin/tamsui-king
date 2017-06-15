# Place in app/channels/ws-channel.rb
# Be sure to restart your server when you modify this file. Action Cable runs in an EventMachine loop that does not support auto reloading.
class WsChannel < ApplicationCable::Channel
  def subscribed
    @uuid = params[:uuid]
    @player_name = params[:playerName]
    stop_all_streams
    stream_from "clock_#{@uuid}, #{@player_name}"
    @subscribed = true
    logger.info ">>> Subscribed #{@uuid}!"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    logger.info ">>> Unsubscribed #{@uuid}!"
    stop_all_streams
    @subscribed = false
  end

  # client to server
  def playerMove(data)
    player_name = data[:player]
    position = data[:position]
    nonce = data[:nonce]
    # TODO
  end

  def plantBomb(data)
    player_name = data[:player]
    bomb_position = data[:position]
    nonce = data[:nonce]
    #TODO
  end

  # server to client
  # TODO
  def broadcast(data)
    ActionCable.server.broadcast "clock_#{@uuid}", data
  end
end
