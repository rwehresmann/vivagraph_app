Rails.application.routes.draw do
  resources :graph, only: [:index]
  get "/data", to: "graph#data", defaults: { :format => 'json' }
  get "/node", to: "graph#node"
  get "/link", to: "graph#link"

  root to: "graph#index"
end
