class CreateReportVotes < ActiveRecord::Migration[7.2]
  def change
    create_table :report_votes do |t|
      t.references :snippet_report, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.integer :vote

      t.timestamps
    end
  end
end
