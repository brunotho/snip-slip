import React, { useState, useEffect } from 'react';
import DiffSnippetCard from './DiffSnippetCard';
import ConstrainedLayout from './ConstrainedLayout';

function ReportReviews() {
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState(null);
    
    const changes = reportData?.changes;
    const originalSnippet = reportData?.original_snippet;

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

    const handleSkip = () => {
        const vote = 3;
    }

    const handleSubmit = (variant) => {
        const snippetId = reportData.snippet_id;
        if (variant === "proposed") {
            const vote = 1;
        } else if (variant === "original") {
            const vote = 2;
        } else {
            throw new Error(`Invalid variant ${variant}`);
        }
    }

    const buildSuggestedSnippet = () => {
        if (changes.is_boring) {
            return originalSnippet;
        } else {
            const suggestedSnippet = { ...originalSnippet };

            Object.keys(changes).forEach(key => {
                if (changes[key] != null) {
                    suggestedSnippet[key] = changes[key];
                }
            });
            return suggestedSnippet;
        }
    }
        

    const renderOriginalSnippet = () => {
        return (
            loading ? (
                <div>
                    <p>Loading...</p>
                </div>
            ) : (
            <div>
                <DiffSnippetCard 
                    snippet={originalSnippet}
                    suggestedSnippet={buildSuggestedSnippet()}
                    variant="original"
                />
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
                    {/* add big red DELETE */}
                    <DiffSnippetCard 
                        snippet={originalSnippet}
                        suggestedSnippet={buildSuggestedSnippet()}
                        variant="proposed"
                    />
                </div>
            ) : (
                <div>
                    <DiffSnippetCard 
                    snippet={originalSnippet}
                    suggestedSnippet={buildSuggestedSnippet()}
                    variant="proposed"
                    />
                </div>
            )
        )
    }
    
    return (
        <ConstrainedLayout>
            <div>
                <h1>Report Review</h1>
                <p>Select between the original snippet and the suggested changes</p>
                <p>Click the one you think is correct</p>
                <div className="snippets-grid">
                    <div className="snippets-grid-item">
                        {renderOriginalSnippet()}
                    </div>
                    <div className="snippets-grid-item">
                        {renderChangedSnippet()}
                    </div>
                </div>
                <button 
                    onClick={() => {handleSkip()}}
                    className="btn btn-neutral"
                >
                    Skip / I don't know
                </button>
            </div>
        </ConstrainedLayout>
    )
}

export default ReportReviews;