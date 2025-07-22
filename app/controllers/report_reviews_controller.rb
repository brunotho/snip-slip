class ReportReviewsController < ApplicationController
  def reports
  end

  def fetch_report
    @snippet_report = SnippetReport
      .where(status: "pending")
      .where.not(
        id: ReportVote.select(:snippet_report_id).where(user_id: current_user.id)
      )
      .sample
      
    if @snippet_report
      render json: report_data(@snippet_report)
    else
      render json: { message: "No more reports to review" }
    end
  end

  def vote
    report_vote = ReportVote.new(vote_params)
    report_vote.user = current_user

    if report_vote.save
      render json: { message: "Vote submitted successfully" }
    else
      render json: { message: "Failed to submit vote" }
    end
  end

  private

  def report_data(report)
    {
      report_id: report.id,
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

  def vote_params
    params.require(:report_vote).permit(:snippet_report_id, :vote)
  end
end
