FactoryBot.define do
  factory :report_vote do
    snippet_report { nil }
    user { nil }
    vote { 1 }
  end
end
