class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
        :recoverable, :rememberable, :validatable

  has_many :game_session_participants, dependent: :destroy
  has_many :game_sessions, through: :game_session_participants
  has_many :rounds, dependent: :destroy

  # Updated friendship associations
  has_many :friendships, dependent: :destroy
  has_many :friends, -> { where(friendships: { status: :accepted }) }, through: :friendships, source: :friend
  has_many :pending_sent_requests, -> { where(status: :pending) }, class_name: 'Friendship', foreign_key: 'user_id'
  has_many :pending_received_requests, -> { where(status: :pending) }, class_name: 'Friendship', foreign_key: 'friend_id'

  def send_friend_request(friend)
    friendships.create(friend: friend, status: :pending)
  end

  def accept_friend_request(friendship)
    friendship.update(status: :accepted) if pending_received_requests.include?(friendship)
  end

  def decline_friend_request(friendship)
    friendship.destroy if pending_received_requests.include?(friendship)
  end

  def remove_friend(friend)
    friendship = friendships.find_by(friend: friend)
    reverse_friendship = friend.friendships.find_by(friend: self)

    friendship.destroy if friendship
    reverse_friendship.destroy if reverse_friendship
  end

  def invitable_friend?(friend)
    friendships.where(friend: friend, status: [:pending, :accepted]).exists?
  end

  # validates :language, inclusion: { in: %w[English German] }

  def total_score
    if (session = game_sessions.last)
      session.rounds.where(user_id: id).map(&:score).compact.sum
    else
      0
    end
  end
end
