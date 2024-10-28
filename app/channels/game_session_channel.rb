class GameSessionChannel < ApplicationCable::Channel
  def subscribed
    p "SUBBING to session_id: #{params[:game_session_id]}"
    @game_session = GameSession.find(params[:game_session_id])
    stream_for @game_session
    p "SUBBED"

    broadcast_player_joined
  end

  def unsubscribed
    p "🍌 UNSUB session_id: #{params[:game_session_id]}"
    broadcast_player_left
  end

  # def ping
  #   puts "🎮 Received ping from client"
  #   transmit(type: 'pong')
  # end

  private

  def broadcast_player_joined
    p "broadcast_player_joined"

    ActionCable.server.broadcast(
      "game_session_#{@game_session_id}",
      {
        type: 'player_joined',
        player: {
          id: current_user.id,
          name: current_user.name,
          rounds_played: 0,
          successful_rounds_count: 0,
          total_score: 0
        }
      }
    )
  end

  def broadcast_player_left
    p "broaddcast_player_left"
    ActionCable.server.broadcast "game_session_#{@game_session_id}", {
      type: 'player_left',
      player_id: current_user.id
    }
  end
end
