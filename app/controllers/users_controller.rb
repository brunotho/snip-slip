class UsersController < ApplicationController
  before_action :authenticate_user!, except: [ :search ]

  def show
    @user = User.find(params[:id])
  end

  def edit
  end

  def update
  end

  def search
    Rails.logger.debug "Search action called"
    Rails.logger.debug "Search params: #{params.inspect}"
    query = params[:q].to_s.strip
    Rails.logger.debug "Query: #{query}"
    if query.length < 2
      Rails.logger.debug "Query too short"
      render json: { error: "Search term must be at least 2 characters long" }, status: :unprocessable_entity
      return
    end
    @users = User.where("name ILIKE :query OR email ILIKE :query", query: "%#{query}%").limit(10)
    Rails.logger.debug "Found users: #{@users.inspect}"
    render json: @users.as_json(only: [ :id, :name, :email ])
  rescue => e
    Rails.logger.error "Search error: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: { error: "An error occurred during search" }, status: :internal_server_error
  end
end
