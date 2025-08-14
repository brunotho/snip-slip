class Friendship < ApplicationRecord
  belongs_to :user
  belongs_to :friend, class_name: "User"

  enum status: { pending: 0, accepted: 1, declined: 2 }

  scope :declined, -> { where(status: :declined) }

  validates :user_id, uniqueness: { scope: :friend_id }
  validate :not_self

  private

  def not_self
    errors.add(:friend, "can't be the same as the user") if user_id == friend_id
  end
end
