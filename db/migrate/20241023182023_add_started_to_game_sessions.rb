class AddStartedToGameSessions < ActiveRecord::Migration[7.2]
  def change
    add_column :game_sessions, :started, :boolean, default: false
  end
end
