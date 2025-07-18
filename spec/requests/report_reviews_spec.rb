require 'rails_helper'

RSpec.describe "ReportReviews", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/report_reviews/index"
      expect(response).to have_http_status(:success)
    end
  end

end
