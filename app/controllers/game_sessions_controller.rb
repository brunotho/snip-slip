class GameSessionsController < ApplicationController
  before_action :authenticate_user! #, only: [ :start_single_player ]

  def show
    @game_session = current_user.game_sessions.find(params[:id])

    # respond_to do |format|
      # format.html
    if @game_session
      render json: game_session_data(@game_session)
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Game session not found" }, status: 404
  end

  def start_single_player
    ActiveRecord::Base.transaction do
      @game_session = current_user.game_sessions.create!
      # @game_session.game_session_participants.create!(user: current_user)
    end
    redirect_to snippets_path
  rescue ActiveRecord::RecordInvalid => e
    redirect_to root_path, alert: "Failed to start session: #{e.message}"
  end

  private

  def successful_rounds_count
    @game_session.rounds.where(user: current_user, success: true).count
  end

  def game_session_data(game_session)
    {
      game_session_id: game_session.id,
      total_score: current_user.total_score,
      successful_rounds_count: game_session.rounds.where(user: current_user, success: true).count,
      rounds_played: game_session.rounds.where(user_id: current_user.id).count,
      status: game_session.status,
      players: game_session.game_session_participants
    }
  end
end
