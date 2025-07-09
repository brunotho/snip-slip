class CreateSnippetReports < ActiveRecord::Migration[7.2]
  def change
    create_table :snippet_reports do |t|
      t.references :lyric_snippet, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.integer :status
      t.boolean :is_boring
      t.boolean :wrong_artist
      t.boolean :wrong_song
      t.boolean :wrong_snippet
      t.boolean :wrong_difficulty
      t.boolean :wrong_language
      t.boolean :wrong_image
      t.string :suggested_artist
      t.string :suggested_song
      t.text :suggested_snippet
      t.integer :suggested_difficulty
      t.string :suggested_language
      t.string :suggested_image_url

      t.timestamps
    end
  end
end
