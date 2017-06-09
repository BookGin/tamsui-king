class BombsController < ApplicationController
  api!
  def index
    @bombs = Bomb.all
    render :json => @bombs.to_json
  end

  api!
  param :id, :number
  def show
    @bomb = Bomb.find_by(:id => params[:id])
    render :json => @bomb.to_json
  end

  api!
  # TODO: add specific params
  def create
    @bomb = Bomb.new(bomb_params) # See private method below
    if @bomb.save
      render :json => {:status => "Success"}.to_json
    else
      render :json => {:status => "Fail"}.to_json
    end
  end

  api!
  param :id, :number
  def destroy
    @bomb = Bomb.find_by(:id => params[:id])
    if @bomb.destory
      render :json => {:status => "Success"}.to_json
    else
      render :json => {:status => "Fail"}.to_json
    end
  end

  private

  def bomb_params
    params.require(:bomb)
      .permit(
        # TODO, must permit all params from bomb
      )
  end
end
