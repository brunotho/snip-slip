class SnippetReportsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_snippet

  def create
    @snippet_report = @snippet.snippet_reports.build(snippet_report_params)
    @snippet_report.user = current_user
    @snippet_report.status = :pending

    if @snippet_report.save
      render json: {
        status: "success",
        message: "Report submitted successfully",
        user_name: current_user.name
      }
    else
      if @snippet_report.errors.details[:user]&.any? { |e| e[:error] == :taken }
        render json: {
          status: "error",
          message: "You have already reported this snippet",
          errors: @snippet_report.errors.full_messages
        }, status: :unprocessable_entity
      else
        render json: {
          status: "error",
          message: "Failed to submit report - snippet_reports_controller#create",
          errors: @snippet_report.errors.full_messages
        }, status: :unprocessable_entity
      end
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
      :suggested_difficulty, :suggested_language, :suggested_image_url
    )
  end
end
