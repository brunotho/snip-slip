class RenameImageUrlToImageInSnippetReports < ActiveRecord::Migration[7.2]
  def change
    rename_column :snippet_reports, :suggested_image_url, :suggested_image
  end
end
