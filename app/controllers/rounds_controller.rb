class RoundsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_game_session

  def create
    unless @game_session.status?
      render json: { error: "Game session is already completed" }, status: 403
      return
    end

    @round = @game_session.rounds.build(round_params)
    @round.user = current_user
    @round.difficulty = @round.lyric_snippet.difficulty

    if @round.save
      @game_session.check_game_session_status

      response_data = {
        message: "Round created successfully // MP:#{@game_session.multiplayer?}",
        round: {
          id: @round.id,
          success: @round.success,
          score: @round.score,
          lyric_snippet: {
            snippet: @round.lyric_snippet.snippet
          }
        },
        game_session: {
          total_score: @game_session.total_score(current_user),
          rounds_played: @game_session.rounds.where(user: current_user).count,
          successful_rounds_count: @game_session.rounds.where(user: current_user, success: true).count,
          status: @game_session.status,
          player_game_over: player_game_over?,
          game_over: !@game_session.status
        }
      }

      if @game_session.multiplayer?
        p "🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡"
        broadcast_data = {
          type: "round_completed",
          game_over: multiplayer_game_over?,
          player: {
            id: current_user.id,
            name: current_user.name,
            rounds_played: @game_session.rounds.where(user: current_user).count,
            successful_rounds_count: @game_session.rounds.where(user: current_user, success: true).count,
            total_score: @game_session.total_score(current_user),
            round_history: @game_session.rounds.where(user_id: current_user.id).map do |round|
              {
                success: round.success,
                lyric_snippet: { snippet: round.lyric_snippet.snippet }
              }
            end
          }
        }
        GameSessionChannel.broadcast_to(@game_session, broadcast_data)
      end

      render json: response_data, status: 201
    else
      render json: { errors: @round.errors.full_messages }, status: 4222
    end
  end

  private

  def set_game_session
    @game_session = current_user.game_sessions.find(params[:game_session_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Game session not found" }, status: 404
  end

  def round_params
    params.require(:round).permit(:lyric_snippet_id, :success)
  end

  def player_game_over?
    @game_session.player_completed?(current_user)
  end

  def multiplayer_game_over?
    @game_session.game_session_participants.all? { |participant|
      @game_session.player_completed?(participant.user)
    }
  end
end
