Rails.application.routes.draw do

  resources :sessions, only: [:new, :create, :destroy]
  resource :map, only: [:show]

  get 'dumb_room/show'
  
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  mount ActionCable.server => "/cable"
  root to: "sessions#new"
end
