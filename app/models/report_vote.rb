class ReportVote < ApplicationRecord
  belongs_to :snippet_report
  belongs_to :user

  enum vote: { approve: 1, reject: 2, skip: 3 }
end
