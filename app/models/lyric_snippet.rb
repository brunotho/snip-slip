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
  validates :language, inclusion: { in: %w[Zulu English German].sort }

  def self.languages
    validators_on(:language).first.options[:in]
  end

  before_create :attach_album_cover

  private

  def attach_album_cover
    image_url = find_best_album_cover

    if image_url
      downloaded_image = URI.open(image_url)
      image.attach(
        io: downloaded_image,
        filename: "#{artist}_#{song}.jpg"
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

  def find_best_album_cover
    url = "https://api.spotify.com/v1/search?q=20track%3A#{song.downcase}%2520artist%3A#{artist.downcase}&type=album"
    response = spotify_api_call(url)

    albums = response.dig("albums", "items")
    return [] unless albums&.any?

    best_match = albums.find do |album|
      album["album_type"] == "album" &&
      album["artists"].any? do |spotify_artist|
        normalize_artist_name(spotify_artist["name"]) == normalize_artist_name(artist)
      end
    end

    best_match&.dig("images", 0, "url")
  end

  def find_alternative_album_covers
    url = "https://api.spotify.com/v1/search?q=artist:#{artist.downcase}&type=album&limit=20"
    response = spotify_api_call(url)

    albums = response.dig("albums", "items")
    return [] unless albums&.any?

    log_spotify_response(response, artist)

    image_url_arrays = albums.map do |album|
      (album["images"] || []).map do |img|
        img["url"]
      end
    end

    all_image_urls = image_url_arrays.flatten.uniq
    # all_image_urls = all_image_urls.reject { |url| url == current_image_url } if current_image_url.present?

    all_image_urls.first(6)
  end

  def spotify_api_call(url)
    url = url
    token = SpotifyService.get_access_token

    HTTParty.get(
      url,
      headers: {
        "Authorization" => "Bearer #{token}"
      }
    )
  end

  # for testing
  def log_spotify_response(response, artist_name = "nil", song_name = "nil")
    p "🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰🥰 START #{artist_name} -- #{song_name}"
    p "Query string: #{response.request.uri.query}"
    p "HTT🥳 encoded params: #{URI.decode_www_form(response.request.uri.query).to_h}"
    p "😶 full response START:"
    # p response
    p JSON.pretty_generate(response.parsed_response)
    p "😶 full response END"
    response["albums"]["items"][0]["images"][0]["url"]
  end
end
