class SnippetReport < ApplicationRecord
  belongs_to :lyric_snippet
  belongs_to :user
end
