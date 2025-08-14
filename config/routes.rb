Rails.application.routes.draw do
  # Health and PWA
  get "up" => "rails/health#show", as: :rails_health_check
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  root "welcome#home"

  # Authentication
  devise_for :users
  get "/auth/spotify/callback", to: "spotify_auth#callback"
  get "/auth/spotify", to: "spotify_auth#authenticate"

  # User management
  get "profile", to: "users#show", as: :user_profile
  get "/users/search", to: "users#search", as: :users_search
  resources :users, only: [ :show, :update ]

  namespace :api do
    resources :users, only: [ :update ]
    get "users/me", to: "users#me"
    delete "users/me", to: "users#destroy"
  end

  # Game functionality
  resources :game_sessions, only: [ :new, :create, :show ] do
    collection do
      post "start_single_player"
      post "start_multiplayer"
    end
    member do
      get "invite"
      post "invite_friend"
      post "start"
      post "accept_invitation"
    end
    resources :rounds, only: [ :create ]
  end

  # Snippets and reports
  resources :snippets, only: [ :index, :new, :create ] do
    resources :snippet_reports, only: [ :create ], path: "reports"
    member do
      get :alternative_album_covers
    end
  end
  get "fetch_snippets", to: "snippets#fetch_snippets"
  get "fetch_report", to: "report_reviews#fetch_report"
  get "reports", to: "report_reviews#reports"
  get "languages", to: "snippets#languages"
  post "reports/:report_id/vote", to: "report_reviews#vote"

  # Social features
  resources :friendships, only: [ :index, :create, :update, :destroy ]

  # Misc
  mount ActionCable.server => "/cable"
  post "record_play", to: "user_played_snippets#record_play"
end
