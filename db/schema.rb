# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2024_12_12_112524) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "friendships", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "friend_id", null: false
    t.integer "status", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["friend_id"], name: "index_friendships_on_friend_id"
    t.index ["user_id", "friend_id"], name: "index_friendships_on_user_id_and_friend_id", unique: true
    t.index ["user_id"], name: "index_friendships_on_user_id"
  end

  create_table "game_session_participants", force: :cascade do |t|
    t.bigint "game_session_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_session_id"], name: "index_game_session_participants_on_game_session_id"
    t.index ["user_id"], name: "index_game_session_participants_on_user_id"
  end

  create_table "game_sessions", force: :cascade do |t|
    t.boolean "status", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "started", default: false
  end

  create_table "lyric_snippets", force: :cascade do |t|
    t.string "snippet"
    t.string "artist"
    t.string "song"
    t.integer "difficulty"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "language"
  end

  create_table "rounds", force: :cascade do |t|
    t.bigint "lyric_snippet_id", null: false
    t.bigint "user_id", null: false
    t.bigint "game_session_id", null: false
    t.boolean "success"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "difficulty"
    t.index ["game_session_id"], name: "index_rounds_on_game_session_id"
    t.index ["lyric_snippet_id"], name: "index_rounds_on_lyric_snippet_id"
    t.index ["user_id"], name: "index_rounds_on_user_id"
  end

  create_table "user_played_snippets", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "lyric_snippet_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lyric_snippet_id"], name: "index_user_played_snippets_on_lyric_snippet_id"
    t.index ["user_id"], name: "index_user_played_snippets_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.string "language", default: "English"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "friendships", "users", column: "friend_id", on_delete: :cascade
  add_foreign_key "friendships", "users", on_delete: :cascade
  add_foreign_key "game_session_participants", "game_sessions"
  add_foreign_key "game_session_participants", "users"
  add_foreign_key "rounds", "game_sessions"
  add_foreign_key "rounds", "lyric_snippets"
  add_foreign_key "rounds", "users"
  add_foreign_key "user_played_snippets", "lyric_snippets"
  add_foreign_key "user_played_snippets", "users"
end
