class SnippetReport < ApplicationRecord
  belongs_to :lyric_snippet, dependent: :destroy
  belongs_to :user, dependent: :destroy

  enum status: { pending: 0, approved: 1, rejected: 2 }

  validates :user, uniqueness: { scope: :lyric_snippet }
  validate :at_least_one_issue_selected
  validate :suggestions_for_wrong_fields_present

  private

  def at_least_one_issue_selected
    issues = [ is_boring, wrong_artist, wrong_song, wrong_snippet, wrong_difficulty, wrong_language, wrong_image ]
    issue_count = issues.count(true)
    unless issue_count > 0
      errors.add(:base, "Must select at least one issue to report")
    end
  end

  def suggestions_for_wrong_fields_present
    fields = [ "artist", "song", "snippet", "difficulty", "language", "image" ]
    fields.each do |field|
      if self.send("wrong_#{field}") == true
        if self.send("suggested_#{field}").blank?
          errors.add("suggested_#{field}".to_sym, "must be provided when wrong_#{field} is true")
        end
      end
    end
  end
end
