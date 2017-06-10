class PersonChannel < ApplicationCable::Channel
  def subscribed
    stream_from "person_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def send_position(data)
    person = Person.find_by(:id => data["person_id"])
    person.lat = data['lat']
    person.lng = data['lng']
    person.save
    ActionCable.server.broadcast 'person_channel', message: person.to_json
  end
end
