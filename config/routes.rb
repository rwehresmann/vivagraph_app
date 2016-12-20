Rails.application.routes.draw do
  resources :graph, only: [:index, :show]
  get "/data", to: "graph#data", defaults: { :format => 'json' }

  root to: "graph#index"
end
