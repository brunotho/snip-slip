class GameSession < ApplicationRecord
  has_many :rounds, dependent: :destroy
  has_many :game_session_participants, dependent: :destroy
  has_many :users, through: :game_session_participants

  before_validation :set_default_status, on: :create

  validates :status, inclusion: { in: [ true, false ] }

  def check_game_session_status
    if multiplayer?
      update(status: false) if game_session_participants.all? { |participant| player_completed?(participant.user) }
    else
      update(status: false) if player_completed?(users.first)
    end
  end

  def player_completed?(user)
    rounds.where(user: user).count >= 5
  end

  def total_score(user)
    rounds.where(user: user).sum(&:score)
  end

  def multiplayer?
    game_session_participants.count > 1
  end

  private

  def set_default_status
    self.status = true
  end
end
