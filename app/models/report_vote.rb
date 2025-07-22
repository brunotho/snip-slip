class ReportVote < ApplicationRecord
  belongs_to :snippet_report, dependent: :destroy
  belongs_to :user, dependent: :destroy

  enum vote: { approve: 1, reject: 2, skip: 3 }
end
