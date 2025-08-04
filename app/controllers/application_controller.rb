class ApplicationController < ActionController::Base
  include ActiveStorage::SetCurrent

  before_action :configure_permitted_paramters, if: :devise_controller?
  before_action :store_user_location!, if: :storable_location?

  helper_method :current_game_session

  # allow_browser versions: :modern

  protected

  def configure_permitted_paramters
    devise_parameter_sanitizer.permit(:sign_up, keys: [ :name, :language ])
    devise_parameter_sanitizer.permit(:account_update, keys: [ :name, :language ])
  end

  private

  def store_user_location!
    store_location_for(:user, request.fullpath) if storable_location?
  end

  def storable_location?
    request.get? && !devise_controller? && !request.xhr?
  end

  def after_sign_in_path_for(resource)
    stored_path = stored_location_for(resource)
    stored_path || root_path
  end

  def after_sign_out_path_for(resource_or_scope)
    new_user_session_path
  end


  def current_game_session
    if user_signed_in?
      current_user.game_sessions.where(status: true).order(created_at: :desc).first
    end
  end
end
