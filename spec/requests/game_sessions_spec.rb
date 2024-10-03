require 'rails_helper'

RSpec.describe "GameSessions", type: :request do
  describe "GET /new" do
    it "returns http success" do
      get "/game_sessions/new"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/game_sessions/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/game_sessions/show"
      expect(response).to have_http_status(:success)
    end
  end

end