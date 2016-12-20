Rails.application.routes.draw do
  resources :graph, only: [:index]
  get "/data", to: "graph#data", defaults: { :format => 'json' }
  get "/node", to: "graph#node"

  root to: "graph#index"
end
