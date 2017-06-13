class BombChannel < ApplicationCable::Channel
  def subscribed
    stream_from "bomb_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def set_bomb(data)
    person = current_user
    person.bombs.create!(
      lat: data["position"]["lat"],
      lng: data["position"]["lng"],
      lasting: data["lasting"],
      radius: data["radius"])
    # Broadcast create with background job, see app/jobs/bomb_job.rb
  end
end
