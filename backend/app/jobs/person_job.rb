class PersonJob < ApplicationJob
  queue_as :default

  def perform(person, message)
    ActionCable.server.broadcast "person_channel", person: person.to_json, message: message 
  end
end
