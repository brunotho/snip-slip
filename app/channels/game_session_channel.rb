class GameSessionChannel < ApplicationCable::Channel
  def subscribed
    puts "🎮 Attempting to subscribe to game session: #{params[:game_session_id]}"
    @game_session_id = params[:game_session_id]
    stream_from "game_session_#{@game_session_id}"
    puts "🎮 Successfully subscribed!"

    # Broadcast current player's join to other players
    broadcast_player_joined
  end

  def unsubscribed
    puts "🎮 Unsubscribed from game session: #{params[:game_session_id]}"
    # Broadcast when a player leaves
    broadcast_player_left
  end

  def ping
    puts "🎮 Received ping from client"
    transmit(type: 'pong')
  end

  private

  def broadcast_player_joined
    puts "🎮 Broadcasting player joined"
    game_session = GameSession.find(@game_session_id)
    current_player = game_session.game_session_participants.find_by(user: current_user)

    ActionCable.server.broadcast "game_session_#{@game_session_id}", {
      type: 'player_joined',
      player: {
        id: current_user.id,
        name: current_user.name,
        rounds_played: 0,
        successful_rounds_count: 0,
        total_score: 0
      }
    }
    puts "🎮 Broadcast completed"
  end

  def broadcast_player_left
    puts "🎮 Broadcasting player left"
    ActionCable.server.broadcast "game_session_#{@game_session_id}", {
      type: 'player_left',
      player_id: current_user.id
    }
    puts "🎮 Broadcast completed"
  end
end
