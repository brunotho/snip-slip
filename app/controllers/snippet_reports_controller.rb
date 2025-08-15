class SnippetReportsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_snippet

  def create
    @snippet_report = @snippet.snippet_reports.build(snippet_report_params)
    @snippet_report.user = current_user
    @snippet_report.status = :pending

    if @snippet_report.save
      render json: { message: "Report submitted successfully" }
    else
      render json: {
        errors: @snippet_report.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def set_snippet
    @snippet = LyricSnippet.find(params[:snippet_id])
  end

  def snippet_report_params
    params.require(:snippet_report).permit(
      :is_boring, :wrong_artist, :wrong_song, :wrong_snippet,
      :wrong_difficulty, :wrong_language, :wrong_image,
      :suggested_artist, :suggested_song, :suggested_snippet,
      :suggested_difficulty, :suggested_language, :suggested_image
    )
  end
end
