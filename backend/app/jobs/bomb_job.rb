class BombJob < ApplicationJob
  queue_as :default

  def perform(bomb)
    ActionCable.server.broadcast "bomb_channel",
                                 bomb: bomb.to_json(methods: :position, except: [:lat, :lng]),
                                 action: "planted"
    sleep(bomb.lasting)
    ActionCable.server.broadcast "bomb_channel",
                                 bomb: bomb.to_json(methods: :position, except: [:lat, :lng]),
                                 action: "explosion"
    check_if_anyone_die(bomb)
    bomb.destroy
  end

  private
  def check_if_anyone_die(bomb)
    Person.all.each do |person|
      if person.in_range?(bomb.lat, bomb.lng, bomb.radius)
        person.destroy
        STDERR.puts("\##{person.id} died!")
      else
        # do nothing
        STDERR.puts("\##{person.id} not died!")
      end
    end
  end
end
