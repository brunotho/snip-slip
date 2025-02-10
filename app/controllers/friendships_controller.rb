class FriendshipsController < ApplicationController
  before_action :authenticate_user!

  def index
    @friendships_data = {
      friends: current_user.friendships.accepted.map { |f| { id: f.id, name: f.friend.name, user_id: f.friend.id } },
      pending_requests: current_user.friendships.pending.map { |f| { id: f.id, name: f.friend.name, user_id: f.friend.id } },
      received_requests: Friendship.pending.where(friend: current_user).map { |f| { id: f.id, name: f.user.name, user_id: f.user.id } }
    }

    respond_to do |format|
      format.html
      format.json { render json: @friendships_data }
    end
  end

  def create
    friend = User.find(params[:friend_id])
    friendship = current_user.send_friend_request(friend)
    if friendship.persisted?
      render json: friendship, status: 201
    else
      render json: friendship.errors, status: 422
    end
  end

  def update
    friendship = Friendship.find(params[:id])

    if friendship && (friendship.user_id == current_user.id || friendship.friend_id == current_user.id)
      case params[:status]
      when "accepted"
        if friendship.update(status: :accepted)
          reverse_friendship = Friendship.find_or_initialize_by(user_id: friendship.friend_id, friend_id: friendship.user_id)
          reverse_friendship.update(status: :accepted)

          updated_data = {
            friends: current_user.friendships.accepted.map { |f| { id: f.id, name: f.friend.name, user_id: f.friend.id } },
            pending_requests: current_user.friendships.pending.where(user_id: current_user.id).map { |f| { id: f.id, name: f.friend.name, user_id: f.friend.id } },
            received_requests: current_user.friendships.pending.where(friend_id: current_user.id).map { |f| { id: f.id, name: f.user.name, user_id: f.user.id } }
          }

          render json: { success: true, message: "Friend request accepted", updated_data: updated_data }, status: :ok
        else
          render json: { error: "Failed to accept friend request" }, status: 422
        end
      when "declined"
        if friendship.update(status: :declined)

          updated_data = {
            friends: current_user.friendships.accepted.map { |f| { id: f.id, name: f.friend.name, user_id: f.friend.id } },
            pending_requests: current_user.friendships.pending.where(user_id: current_user.id).map { |f| { id: f.id, name: f.friend.name, user_id: f.friend.id } },
            received_requests: current_user.friendships.pending.where(friend_id: current_user.id).map { |f| { id: f.id, name: f.user.name, user_id: f.user.id } }
          }

          render json: { success: true, message: "Friend request declined", updated_data: updated_data }, status: :ok
        else
          render json: { error: "Failed to decline friend request" }, status: 422
        end
      else
        render json: { error: "Invalid status" }, status: 422
      end
    else
      render json: { error: "Friendship not found or unauthorized" }, status: 404
    end
  end

  def destroy
    friendship = Friendship.find(params[:id])
    if friendship && (friendship.user_id == current_user.id || friendship.friend_id == current_user.id)
      friendship.destroy
      render json: { success: true }, status: :ok
    else
      render json: { error: "Friendship not found or unauthorized :<" }, status: 422
    end
  end
end
