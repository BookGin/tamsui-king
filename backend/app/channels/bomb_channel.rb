class BombChannel < ApplicationCable::Channel
  def subscribed
    stream_from "bomb_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def set_bomb(data)
    person = Person.find_by(:id => data["person_id"])
    person.bombs.create!(lat: data["lat"], lng: data["lng"], lasting: data["time_to_bomb"], radius: data["radius"])
    # Broadcast create with background job, see app/jobs/bomb_job.rb
  end
end
