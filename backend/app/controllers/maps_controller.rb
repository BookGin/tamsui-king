class MapsController < ApplicationController
  def show
    @people = Person.all
    @bombs = Bomb.all
  end
end
