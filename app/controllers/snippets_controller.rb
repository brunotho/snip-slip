class SnippetsController < ApplicationController
  before_action :authenticate_user!, except: [ :index ]

  def index
    @game_session = current_game_session
  end

  def new
    @lyric_snippet = LyricSnippet.new
  end

  def create
    @lyric_snippet = LyricSnippet.new(snippet_params)

    if @lyric_snippet.save
      @snippet_data = @lyric_snippet.as_json.merge(
        image_url: @lyric_snippet.image.attached? ? @lyric_snippet.image.url : nil
      )
      render :thank_you
    else
      render :new, status: 422
    end
  end

  def fetch_snippets
    user_language = current_user&.language || "English"
    reported_snippet_ids = current_user&.snippet_reports&.where(status: "pending").pluck(:lyric_snippet_id) || []
    snippets = LyricSnippet
                .where.not(snippet: "Dummy snippet for failed rounds")
                .where(language: user_language)
                .where.not(id: reported_snippet_ids)
                .order(("RANDOM()"))
                .limit(4)

    render json: snippets.map { |snippet|
      snippet.as_json.merge({
        image_url: snippet.image.attached? ? snippet.image.url : nil
      })
    }
  end

  def alternative_album_covers
    snippet = LyricSnippet.find(params[:id])
    alternative_album_covers = snippet.send(:find_alternative_album_covers)
    render json: alternative_album_covers
  end

  def languages
    render json: LyricSnippet.languages
  end

  private

  def snippet_params
    params.require(:lyric_snippet).permit(:snippet, :artist, :song, :difficulty, :language)
  end
end
