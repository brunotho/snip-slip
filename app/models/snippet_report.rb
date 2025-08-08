class SnippetReport < ApplicationRecord
  belongs_to :lyric_snippet, dependent: :destroy
  belongs_to :user, dependent: :destroy
  has_many :report_votes, dependent: :destroy

  enum status: { pending: 0, approved: 1, rejected: 2 }

  validates :user, uniqueness: {
    scope: :lyric_snippet,
    conditions: -> { where(status: :pending) },
    message: "can only have one pending report per snippet"
  }
  validate :at_least_one_issue_selected
  validate :suggestions_for_wrong_fields_present

  after_update :update_lyric_snippet!, if: :saved_change_to_status?

  def completed?
    # increase number when sufficient amount of users are reviewing reports
    report_votes.where(vote: [ "approve", "disapprove" ]).count >= 1
  end

  def update_status!
    # in production: do a comparative count of approved/disapproved or 'best of X' when completed? increase number when sufficient amount of users
    if report_votes&.where(vote: "approve").count >= 1
      self.status = "approved"
    elsif report_votes&.where(vote: "disapprove").count >= 1
      self.status = "rejected"
    else
      self.status = "pending"
    end
    self.save!
  end

  def approved?
    self.status == "approved"
  end

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

  def update_lyric_snippet!
    return unless self.status == "approved"

    if is_boring
      destroy_lyric_snippet!
    else
      changes = {}
      changes[:artist]     = suggested_artist     if wrong_artist
      changes[:song]       = suggested_song       if wrong_song
      changes[:snippet]    = suggested_snippet    if wrong_snippet
      changes[:difficulty] = suggested_difficulty if wrong_difficulty
      changes[:language]   = suggested_language   if wrong_language

      lyric_snippet.update(changes) if changes.any?

      if wrong_image && suggested_image
        lyric_snippet.image.purge
        lyric_snippet.image.attach(
            io: URI.open(suggested_image),
            filename: "#{lyric_snippet.artist}_#{lyric_snippet.song}.jpg"
          )
      end
    end
  end

  def destroy_lyric_snippet!
    # FIXME: Should check for active game sessions before deletion
    # Current implementation prioritizes content moderation over game continuity
    lyric_snippet.destroy
  end
end
