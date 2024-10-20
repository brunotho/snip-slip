class GameSessionChannel < ApplicationCable::Channel
  def subscribed
    stream_from "game_session_#{params[:game_session_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
