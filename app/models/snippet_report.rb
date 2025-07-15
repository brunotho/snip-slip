class SnippetReport < ApplicationRecord
  belongs_to :lyric_snippet
  belongs_to :user

  enum status: { pending: 0, approved: 1, rejected: 2 }

  validates :user, uniqueness: { scope: :lyric_snippet }
  validate :one_to_two_issues_selected

  private

  # todo update validations to match react form
  def one_to_two_issues_selected
    issues = [ is_boring, wrong_artist, wrong_song, wrong_snippet, wrong_difficulty, wrong_language, wrong_image ]
    issue_count = issues.count(true)
    unless issue_count == 1 || issue_count == 2
      errors.add(:base, "Select one or two issues to report")
    end
  end
end
