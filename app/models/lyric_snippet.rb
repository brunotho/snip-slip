class LyricSnippet < ApplicationRecord
  has_many :rounds, dependent: :destroy

  validates :snippet, presence: true
  validates :artist, presence: true
  validates :song, presence: true
  validates :difficulty, presence: true, inclusion: { in: 0..1000 }
  validates :language, inclusion: { in: %w[English German] }

  def self.languages
    validators_on(:language).first.options[:in]
  end
end
