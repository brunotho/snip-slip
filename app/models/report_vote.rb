class ReportVote < ApplicationRecord
  belongs_to :snippet_report
  belongs_to :user
end
