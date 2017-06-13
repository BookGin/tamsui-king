class Person < ApplicationRecord
  has_many :bombs
  before_destroy { PersonJob.perform_later(self, "died") }
  after_save { PersonJob.perform_later(self, "positioned") }

  def in_range?(_lat, _lng, _radius)
    return (self.lat-_lat) ** 2 + (self.lng-_lng) ** 2 < _radius ** 2
  end

  def position
    return {"lat": lat, "lng": lng}
  end
  
end
