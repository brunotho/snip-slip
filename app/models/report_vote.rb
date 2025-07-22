class ReportVote < ApplicationRecord
  belongs_to :snippet_report
  belongs_to :user

  enum vote: { approve: 1, disapprove: 2, skip: 3 }

  validates :user_id, uniqueness: { scope: :snippet_report_id }
  validates :vote, presence: true,
                   inclusion: { in: votes.keys }

  after_create :update_snippet_report_status

  private

  def update_snippet_report_status
    snippet_report.update_status!
  end
end
