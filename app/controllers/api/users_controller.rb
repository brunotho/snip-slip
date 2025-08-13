class Api::UsersController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :authenticate_user!, only: [ :me ]

  def update
    if updating_sensitive_info?(user_params)
      if current_user.valid_password?(params[:user][:current_password])
        if current_user.update(user_params.except(:current_password))
          render json: current_user.as_json(only: [ :name, :language ])
        else
          render json: { errors: current_user.errors }, status: 422
        end
      else
        render json: { errors: { current_password: [ "is incorrect" ] } }, status: 422
      end
    else
      if current_user.update(user_params.except(:password, :password_confirmation, :current_password))
        render json: current_user.as_json(only: [ :name, :language ])
      else
        render json: { errors: current_user.errors }, status: 422
      end
    end
  end

  def me
    if current_user
      render json: current_user.as_json(only: [ :id, :name, :language ])
    else
      render json: { id: nil, name: nil, language: "English" }
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :language, :password, :password_confirmation, :current_password)
  end

  def updating_sensitive_info?(params)
    params[:password].present?
  end
end
