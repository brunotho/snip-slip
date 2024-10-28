class GameSessionsController < ApplicationController
  before_action :authenticate_user! #, only: [ :start_single_player ]
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
    p "🤡🤡🤡🤡🤡🤡"
    puts "===================="
    puts "Params received: #{params.inspect}"
    puts "Friend ID received: #{params[:friend_id]}"
    puts "===================="
    # raise
    friend = User.find(params[:friend_id])
    if current_user.invitable_friend?(friend)
      broadcast_game_invitation(friend)
      render json: { message: "Friend invited successfully" }
    else
      render json: { error: "You can only invite friends with pending or accepted status" }, status: 422
    end
  end

  def broadcast_game_invitation(user)
    p "😎😎😎😎😎"
    Rails.logger.info "=== Broadcasting invitation ==="
    Rails.logger.info "Game Session: #{@game_session.id}"
    Rails.logger.info "To user: #{user.inspect}"
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
    # Rails.logger.info "=== Accept Invitation ==="
    # Rails.logger.info "Game Session ID: #{params[:id]}"
    # Rails.logger.info "Current User: #{current_user.inspect}"

    @game_session = GameSession.find(params[:id])
    # Rails.logger.info "Game Session found: #{@game_session.inspect}"
    # Rails.logger.info "Current participants: #{@game_session.game_session_participants.map(&:user_id)}"

    begin
      participant = @game_session.game_session_participants.create!(user: current_user)
      # Rails.logger.info "Participant created: #{participant.inspect}"
      broadcast_player_joined(current_user)
      render json: {
        message: "Successfully joined game",
        redirect_url: invite_game_session_path(@game_session)
      }, status: :ok
    rescue ActiveRecord::RecordInvalid => e
      # Rails.logger.error "Failed to create participant: #{e.message}"
      # Rails.logger.error e.record.errors.full_messages
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

    {
      game_session_id: game_session.id,
      current_player_id: current_user.id,
      current_player_name: current_user.name,
      is_host: first_participant.user_id == current_user.id,
      total_score: current_user.total_score,
      successful_rounds_count: game_session.rounds.where(user: current_user, success: true).count,
      rounds_played: game_session.rounds.where(user_id: current_user.id).count,
      status: game_session.status,
      players: game_session.game_session_participants.map do |participant|
        { id: participant.user.id,
          name: participant.user.name,
          total_score: participant.user.total_score,
          successful_rounds_count: game_session.rounds.where(user: participant.user, success: true).count,
          rounds_played: game_session.rounds.where(user_id: participant.user.id).count,
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
