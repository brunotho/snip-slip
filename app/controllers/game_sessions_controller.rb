class GameSessionsController < ApplicationController
  before_action :authenticate_user! #, only: [ :start_single_player ]
  before_action :set_game_session, only: [:show, :invite_friend, :leave_game]

  def show
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

  def start_multiplayer
    ActiveRecord::Base.transaction do
      @game_session = current_user.game_sessions.create!
      @game_session.game_session_participants.create!(user: current_user)
    end
    render json: game_session_data(@game_session)
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: "Failed to start multiplayer session: #{e.message}" }, status: 422
  end

  def invite_friend
    friend = User.find(params[:friend_id])
    if current_user.invitable_friend?(friend)
      @game_session.game_session_participants.create!(user: friend)
      broadcast_player_joined(friend)
      render json: { message: "Friend invited successfully" }
    else
      render json: { error: "You can only invite friends with pending or accepted status" }, status: 422
    end
  end

  def leave_game
    participant = @game_session.game_session_participants.find_by(user: current_user)
    if participant
      participant.destroy
      default_remaining_rounds_to_failed
      broadcast_player_left(current_user)
      render json: { message: "Left the game successfully" }
    else
      render json: { error: "You are not a participant in this game" }, status: 422
    end
  end

  private

  def set_game_session
    @game_session = current_user.game_sessions.find(params[:id])
  end

  def game_session_data(game_session)
    {
      game_session_id: game_session.id,
      total_score: current_user.total_score,
      successful_rounds_count: game_session.rounds.where(user: current_user, success: true).count,
      rounds_played: game_session.rounds.where(user_id: current_user.id).count,
      status: game_session.status,
      players: game_session.game_session_participants.map do |participant|
        { id: participant.user.id,
          name: participant.user.name,
          total_score: participant.user.total_score,
          successful_rounds_count: game_session.rounds.where(user: participant.user, success: true).count,
          rounds_played: game_session.rounds.where(user_id: participant.user.id).count
        }
      end,
      multiplayer:game_session.multiplayer?
    }
  end

  def broadcast_player_joined(user)
    GameSessionChannel.broadcast_to(@game_session, {
      type: "player_joined",
      user: { id: user.id, name: user.name }
    })
  end

  def broadcast_player_left
    GameSessionChannel.broadcast_to(@game_session, {
      type: "player_left",
      user: { id: user.id, name: user.name }
    })
  end

  def default_remaining_rounds_to_failed
    remaining_rounds = 5 - @game_session.rounds.where(user: current_user).count
    dummy_snippet = LyricSnippet.find_by(artist: "System", song: "Failed Round")

    remaining_rounds.times do
      @game_session.rounds.create!(
        user: current_user,
        success: false,
        score: 0,
        lyric_snippet: dummy_snippet
      )
    end
  end
end
