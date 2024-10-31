class CreateFriendships < ActiveRecord::Migration[7.2]
  def change
    create_table :friendships do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.references :friend, null: false, foreign_key: { to_table: :users, on_delete: :cascade }
      t.integer :status, default: 0

      t.timestamps
    end

    add_index :friendships, [:user_id, :friend_id], unique: true
  end
end
