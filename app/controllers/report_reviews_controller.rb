class ReportReviewsController < ApplicationController
  def index
    @snippet_report = SnippetReport.all.sample
    respond_to do |format|
      format.html
      format.json { render json: report_data(@snippet_report) }
    end
  end

  private

  def report_data(report)
    {
      original_snippet: report.lyric_snippet.as_json.merge({
        image_url: report.lyric_snippet.image.attached? ? report.lyric_snippet.image.url : nil
      }),
      changes: {
        is_boring: report.is_boring,
        artist: report.wrong_artist ? report.suggested_artist : nil,
        song: report.wrong_song ? report.suggested_song : nil,
        snippet: report.wrong_snippet ? report.suggested_snippet : nil,
        difficulty: report.wrong_difficulty ? report.suggested_difficulty : nil,
        language: report.wrong_language ? report.suggested_language : nil,
        image_url: report.wrong_image ? report.suggested_image : nil
      }
    }
  end
end
