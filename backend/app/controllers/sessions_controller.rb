class SessionsController < ApplicationController
  skip_before_action :ensure_authenticated_user, only: %i( new create )

  def new

  end

  def create
    lat, lng = get_geolocation
    person = Person.create!(lat: lat, lng: lng)
    authenticate_user(person.id)
    redirect_to map_url
  end

  def destroy
    unauthenticate_user
    redirect_to new_session_url
  end

  private
  def get_geolocation
    # TODO, but not very urgent
    fake_location = [100.0, 100.0]
    return fake_location
  end
end
