Rails.application.routes.draw do
  resources :graph, only: [:index]
  root to: "graph#index"
end
