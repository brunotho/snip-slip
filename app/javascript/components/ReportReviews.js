import React, { useState, useEffect } from 'react';
import SnippetCard from './SnippetCard';
import ConstrainedLayout from './ConstrainedLayout';

function ReportReviews() {
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch('/fetch_report', {
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
            })
            .catch(error => {
                console.error('Error fetching report data:', error);
                setLoading(false);
            });
    }, []);

    const handleSkip = () => {}

    const buildSuggestedSnippet = () => {
        if (reportData.changes.is_boring) {
            return reportData.original_snippet;
        } else {
            const suggestedSnippet = {
                ...reportData.original_snippet,
                artist: reportData.changes.suggested_artist,
                song: reportData.changes.suggested_song,
                snippet: reportData.changes.suggested_snippet,
                image_url: reportData.changes.suggested_image_url,
            }
            return suggestedSnippet;
        }
    }
        

    const renderOriginalSnippet = () => {
        console.log("🤔")
        console.log("Loading state:", loading);
        console.log("Report data:", reportData);
        return (
            loading ? (
                <div>
                    <p>Loading...</p>
                </div>
            ) : (
            <div>
                <SnippetCard snippet={reportData.original_snippet} />
            </div>
        ))
    }

    const renderChangedSnippet = () => {
        return (
            loading ? (
                <div>
                    <p>Loading...</p>
                </div>
            ) : reportData.changes.is_boring ? (
                <div>
                    {/* add big red cross */}
                    <SnippetCard snippet={reportData.original_snippet} />
                </div>
            ) : (
                <div>
                    <SnippetCard snippet={reportData.changed_snippet} />
                </div>
            )
        )
    }

    return (
        <ConstrainedLayout>
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
        </ConstrainedLayout>
    )
}

export default ReportReviews;