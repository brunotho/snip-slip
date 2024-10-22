class GameSessionChannel < ApplicationCable::Channel
  def subscribed
    @game_session_id = params[:game_session_id]
    stream_from "game_session_#{@game_session_id}"

    # Broadcast current player's join to other players
    broadcast_player_joined
  end

  def unsubscribed
    # Broadcast when a player leaves
    broadcast_player_left
  end

  private

  def broadcast_player_joined
    game_session = GameSession.find(@game_session_id)
    current_player = game_session.game_session_participants.find_by(user: current_user)

    ActionCable.server.broadcast "game_session_#{@game_session_id}", {
      action: 'player_joined',
      player: {
        id: current_user.id,
        name: current_user.name,
        rounds_played: 0,
        successful_rounds_count: 0,
        total_score: 0
      }
    }
  end

  def broadcast_player_left
    ActionCable.server.broadcast "game_session_#{@game_session_id}", {
      action: 'player_left',
      player_id: current_user.id
    }
  end
end
