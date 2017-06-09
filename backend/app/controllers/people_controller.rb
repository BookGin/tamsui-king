class PeopleController < ApplicationController
  api!
  def index
    @people = Person.all
    render :json => @people.to_json
  end
  
  api!
  param :id, :number
  def show
    @person = Person.find_by(:id => params[:id])
    render :json => @person.to_json
  end

  api!
  # TODO: add specific params
  def create
    @person = Person.new(person_params) # See private method below
    if @person.save
      render :json => {:status => "Success"}.to_json
    else
      render :json => {:status => "Fail"}.to_json
    end
  end

  api!
  param :id, :number
  def destroy
    @person = Person.find_by(:id => params[:id])
    if @person.destroy
      render :json => {:status => "Success"}.to_json
    else
      render :json => {:status => "Fail"}.to_json
    end
  end

  private

  def person_params
    params.require(:person)
      .permit(
        # TODO, must permit all params from person
      )
  end
end
