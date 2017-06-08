class DumbEndpointsController < ApplicationController
  api!
  def index
    render :json => {:message => "Dumb"}.to_json
  end

  api!
  param :id, :number
  def show
    n = params[:id]
    render :json => {:message => "The number is #{n}."}.to_json
  end
  
end
