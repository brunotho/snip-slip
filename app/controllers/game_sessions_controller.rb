class GameSessionsController < ApplicationController
  before_action :store_user_location!, if: :storable_location?
  before_action :authenticate_user!
  before_action :set_game_session, only: [:show, :invite_friend, :leave_game]

  def show
    @game_session = GameSession.find(params[:id])

    respond_to do |format|
      format.html
      format.json { render json: game_session_data(@game_session) }
    end
  rescue ActiveRecord::RecordNotFound
    respond_to do |format|
      format.html { redirect_to root_path, alert: "Game session not found" }
      format.json { render json: { error: "Game session not found" }, status: 404 }
    end
  end

  def start_single_player
    ActiveRecord::Base.transaction do
      @game_session = GameSession.create!
      @game_session.game_session_participants.create!(user: current_user)
      redirect_to snippets_path
    end
  rescue ActiveRecord::RecordInvalid => e
    redirect_to root_path, alert: "Failed to start singleplayer session: #{e.message}"
  end

  def start_multiplayer
    ActiveRecord::Base.transaction do
      @game_session = GameSession.create!
      @game_session.game_session_participants.create!(user: current_user)
      redirect_to invite_game_session_path(@game_session)
    end
  rescue ActiveRecord::RecordInvalid => e
    redirect_to root_path, alert: "Failed to start multiplayer session: #{e.message}"
  end

  def invite
    @game_session = GameSession.find(params[:id])
  rescue
    redirect_to root_path, alert: "Game session not found"
  end

  def invite_friend
    friend = User.find(params[:friend_id])
    if current_user.invitable_friend?(friend)
      broadcast_game_invitation(friend)
      render json: { message: "Friend invited successfully" }
    else
      render json: { error: "You can only invite friends with pending or accepted status" }, status: 422
    end
  end

  def broadcast_game_invitation(user)
    ActionCable.server.broadcast(
      "user_notifications",
      {
        type: "game_invitation",
        game_session_id: @game_session.id,
        player: {
          id: user.id,
          name: user.name
        },
        inviter: {
          id: current_user.id,
          name: current_user.name
        }
      }
    )
  end

  def accept_invitation
    @game_session = GameSession.find(params[:id])
    begin
      participant = @game_session.game_session_participants.create!(user: current_user)
      broadcast_player_joined(current_user)
      render json: {
        message: "Successfully joined game",
        redirect_url: invite_game_session_path(@game_session)
      }, status: :ok
    rescue ActiveRecord::RecordInvalid => e
      render json: { error: e.message }, status: 422
    end
  end

  def start
    @game_session = GameSession.find(params[:id])

    if @game_session.game_session_participants.exists?(user: current_user)
      @game_session.update!(started: true)
      broadcast_game_start
      render json: { message: "Game started successfully" }
    else
      render json: { error: "Not authorized to start this game" }, status: :unauthorized
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
    first_participant = game_session.game_session_participants.order(:created_at).first
    user_rounds = game_session.rounds.where(user: current_user).includes(:lyric_snippet).order(:created_at)

    {
      game_session_id: game_session.id,
      current_player_id: current_user.id,
      current_player_name: current_user.name,
      is_host: first_participant.user_id == current_user.id,
      total_score: user_rounds.sum(&:score),
      successful_rounds_count: game_session.rounds.where(user: current_user, success: true).count,
      rounds_played: game_session.rounds.where(user_id: current_user.id).count,
      status: game_session.status,
      round_history: user_rounds.map do |round|
        {
          lyric_snippet: {
            snippet: round.lyric_snippet.snippet
          },
          success: round.success
        }
      end,
      players: game_session.game_session_participants.each_with_object({}) do |participant, hash|
        participant_rounds = game_session.rounds.where(user: participant.user).includes(:lyric_snippet).order(:created_at)
        game_session_score = participant_rounds.sum(&:score)
        hash[participant.user.id] = {
          id: participant.user.id,
          name: participant.user.name,
          total_score: game_session_score,
          successful_rounds_count: game_session.rounds.where(user: participant.user, success: true).count,
          rounds_played: game_session.rounds.where(user_id: participant.user.id).count,
          round_history: participant_rounds.map do |round|
            {
              lyric_snippet: {
                snippet: round.lyric_snippet.snippet
              },
              success: round.success
            }
          end
        }
      end,
      multiplayer: game_session.multiplayer?
    }
  end

  def broadcast_player_joined(user)
    GameSessionChannel.broadcast_to(@game_session, {
      type: "player_joined",
      player: { id: user.id, name: user.name }
    })
  end

  def broadcast_player_left
    GameSessionChannel.broadcast_to(@game_session, {
      type: "player_left",
      player: { id: user.id, name: user.name }
    })
  end

  def broadcast_game_start
    GameSessionChannel.broadcast_to(@game_session, {
        type: "game_start",
        game_session_id: @game_session.id
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
