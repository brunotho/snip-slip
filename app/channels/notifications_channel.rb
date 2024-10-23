class NotificationsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "user_notifications"
  end
end
