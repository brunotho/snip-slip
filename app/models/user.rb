class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
        :recoverable, :rememberable, :validatable

  has_many :game_session_participants, dependent: :destroy
  has_many :game_sessions, through: :game_session_participants
  has_many :rounds, dependent: :destroy

  # validates :language, inclusion: { in: %w[English German] }

  def total_score
    if (session = game_sessions.last)
      session.rounds.where(user_id: id).map(&:score).compact.sum
    else
      0
    end
  end
end
