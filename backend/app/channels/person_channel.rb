class PersonChannel < ApplicationCable::Channel
  def subscribed
    stream_from "person_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def send_position(data)
    # person_id Based on cookie
    person = current_user
    person.lat = data['position']['lat']
    person.lng = data['position']['lng']
    person.save
    # Find broadcast details in app/models/person.rb and app/jobs/person_job.rb
  end

  def init(data)
    print(data)
    ActionCable.server.broadcast "person_channel",
                                 person: current_user.to_json(methods: :position, except: [:lat, :lng]),
                                 action: "init",
                                 nonce: data["nonce"]
  end
  
end
