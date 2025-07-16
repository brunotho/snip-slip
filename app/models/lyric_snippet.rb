class LyricSnippet < ApplicationRecord
  has_one_attached :image
  has_many :rounds, dependent: :destroy
  has_many :user_played_snippets
  has_many :users_who_played, through: :user_played_snippets, source: :user
  has_many :snippet_reports, dependent: :destroy

  validates :snippet, presence: true
  validates :snippet, length: { minimum: 5, maximum: 70 }
  validates :artist, presence: true
  validates :artist, length: { minimum: 2, maxium: 20 }
  validates :song, presence: true
  validates :song, length: { minimum: 2, maxium: 30 }
  validates :difficulty, presence: true
  validates :difficulty, inclusion: { in: 0..1000 }
  validates :language, inclusion: { in: %w[English German] }

  def self.languages
    validators_on(:language).first.options[:in]
  end

  before_save :attach_album_cover

  private

  def attach_album_cover
    artist_name = artist
    song_name = song

    image_url = find_best_album_match(spotify_api_call(artist_name, song_name), artist_name)
    # return unless image_url

    p "IMAGE_URL:"
    p image_url
    p "😎😋😊😎😋 END"

    if image_url
      downloaded_image = URI.open(image_url)
      image.attach(
        io: downloaded_image,
        filename: "#{artist_name}_#{song_name}.jpg"
      )
    else
      default_image = File.open(Rails.root.join("app/assets/images/placeholder_album_cover.jpg"))
      image.attach(
        io: default_image,
        filename: "default_album.jpg"
      )
    end
  end

  def normalize_artist_name(name)
    # todo: add äö!`^ etc
    name.downcase.gsub(/[^a-z0-9\s]/i, "").strip
  end

  def find_best_album_match(response, artist_name)
    albums = response.dig("albums", "items")
    return nil unless albums&.any?

    best_match = albums.find do |album|
      album["album_type"] == "album" &&
      album["artists"].any? do |artist|
        normalize_artist_name(artist["name"]) == normalize_artist_name(artist_name)
      end
    end

    best_match&.dig("images", 0, "url")
  end

  def spotify_api_call(artist_name, song_name)
    token = SpotifyService.get_access_token
    url = "https://api.spotify.com/v1/search?q=20track%3A#{song_name.downcase}%2520artist%3A#{artist_name.downcase}&type=album"

    response = HTTParty.get(
      url,
      headers: {
        "Authorization" => "Bearer #{token}"
      }
    )

    p "🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰 START #{artist_name} -- #{song_name}"
    p "Query string: #{response.request.uri.query}"
    p "HTT🥳 encoded params: #{URI.decode_www_form(response.request.uri.query).to_h}"
    p "😶 full response START:"
    # p response
    p JSON.pretty_generate(response.parsed_response)
    p "😶 full response END"
    # response["albums"]["items"][0]["images"][0]["url"]
    response
  end
end
