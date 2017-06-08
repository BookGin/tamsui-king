Rails.application.routes.draw do
  apipie

  resources :dumb_endpoints, only: [:index, :show]
end
