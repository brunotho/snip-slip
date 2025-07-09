FactoryBot.define do
  factory :snippet_report do
    lyric_snippet { nil }
    user { nil }
    status { 1 }
    is_boring { false }
    wrong_artist { false }
    wrong_song { false }
    wrong_snippet { false }
    wrong_difficulty { false }
    wrong_language { false }
    wrong_image { false }
    suggested_artist { "MyString" }
    suggested_song { "MyString" }
    suggested_snippet { "MyText" }
    suggested_difficulty { 1 }
    suggested_language { "MyString" }
    suggested_image_url { "MyString" }
  end
end
