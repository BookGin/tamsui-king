class Bomb < ApplicationRecord
  belongs_to :person
  after_create_commit { BombJob.perform_later(self) }
end
