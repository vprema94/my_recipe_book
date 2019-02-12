Rails.application.routes.draw do
  resources :comments
  resources :rec_ings
  resources :ingredients
  resources :recipes
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
