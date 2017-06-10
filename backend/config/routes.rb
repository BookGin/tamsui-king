Rails.application.routes.draw do
  get 'dumb_room/show'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  mount ActionCable.server => "/cable"
end
