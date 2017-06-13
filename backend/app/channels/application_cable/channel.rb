module ApplicationCable
  class Channel < ActionCable::Channel::Base
    delegate :find_verified_user, to: :connection
    # dont allow the clients to call those methods
    protected :find_verified_user
  end
end
