import React, { useState, useEffect } from 'react';

function ReportReviews() {
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch('/reports', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} - Failed to fetch report data`);
                }
                return response.json();
            })
            .then(data => {
                setReportData(data);
                setLoading(false);
                console.log("😀")
                console.log("Report data:", data);
            })
            .catch(error => {
                console.error('Error fetching report data:', error);
                setLoading(false);
            });
    }, []);

    const handleSkip = () => {}

    const renderOriginalSnippet = () => {
        // console.log("Rendering original snippet:", reportData.original_snippet);
        <div>
            {/* {reportData.original_snippet.artist}
            {reportData.original_snippet.song}
            {reportData.original_snippet.snippet}
            {reportData.original_snippet.image_url} */}
            <p>
                hi
            </p>
        </div>
    }

    const renderChangedSnippet = () => {
        <div>
            {/* {reportData.changes.suggested_artist}
            {reportData.changes.suggested_song}
            {reportData.changes.suggested_snippet}
            {reportData.changes.suggested_image_url} */}
        </div>
    }

    return (
        <div>
            <h1>Report Review (react)</h1>
            <p>Select between the original snippet and the suggested changes</p>
            <p>Simply Click the one you think is correct</p>
            <div>
                {renderOriginalSnippet()}
                {renderChangedSnippet()}
            </div>
            <button onClick={() => {}}>Skip/I don't know</button>
        </div>
    )
}

export default ReportReviews;