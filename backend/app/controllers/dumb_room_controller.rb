class DumbRoomController < ApplicationController
  def show
    @dumbs = Dumb.all
  end
end
