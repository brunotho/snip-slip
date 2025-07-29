import React, { useState, useEffect } from 'react';
import DiffSnippetCard from './DiffSnippetCard';
import ConstrainedLayout from './ConstrainedLayout';

function ReportReviews() {
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState(null);
    const [allReportsDone, setAllReportsDone] = useState(false);
    
    const changes = reportData?.changes;
    const originalSnippet = reportData?.original_snippet;

    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessfulVoteView, setShowSuccessfulVoteView] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchReport();
    }, []);
    
    const fetchReport = async () => {
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
                if (data.message === "No more reports to review") {
                    setAllReportsDone(true);
                } else {
                    setReportData(data);
                }
            setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching report data:', error);
                setLoading(false);
            });
    }

    const handleVote = async (variant) => {
        const reportId = reportData.report_id;
        let vote;
        if (variant === "proposed") {
            vote = 1;
        } else if (variant === "original") {
            vote = 2;
        } else if (variant === "skip") {
            vote = 3;
        } else {
            throw new Error(`Invalid variant ${variant}`);
        }

        const response = await fetch(`/reports/${reportId}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Token': getCSRFToken(),
            },
            body: JSON.stringify({
                report_vote: {
                snippet_report_id: reportId,
                vote: vote,
            }}),
        });
        if (response.ok) {
            setShowSuccessfulVoteView(true);
        } else {
            console.error('Failed to submit vote');
            setErrorMessage('Failed to submit vote');
        }
    }
    
    const handleAnotherOne = async () => {
        setShowSuccessfulVoteView(false);
        setLoading(true);
        fetchReport();
    }

    const getCSRFToken = () => {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta && meta.getAttribute('content');
      };

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
                <div>
                <DiffSnippetCard 
                    snippet={originalSnippet}
                    suggestedSnippet={buildSuggestedSnippet()}
                    variant="original"
                    handleVote={() => handleVote("original")}
                />
            </div>
        )
    }

    const renderChangedSnippet = () => {
        return (
            reportData.changes.is_boring ? (
                <div>
                    {/* add big red DELETE */}
                    <DiffSnippetCard 
                        snippet={originalSnippet}
                        suggestedSnippet={buildSuggestedSnippet()}
                        variant="proposed"
                        handleVote={() => handleVote("proposed")}
                    />
                </div>
            ) : (
                <div>
                    <DiffSnippetCard 
                    snippet={originalSnippet}
                    suggestedSnippet={buildSuggestedSnippet()}
                    variant="proposed"
                    handleVote={() => handleVote("proposed")}
                    />
                </div>
            )
        )
    }

    const renderSuccessfulVoteView = () => {
        return (
            <div>
                <p>Thank you ❤️</p>
                <p>Vote submitted successfully</p>

                <button 
                    onClick={handleAnotherOne}
                    className="btn btn-primary"
                >
                    Another one!
                </button>
            </div>
        )
    }
    
    return (
        <ConstrainedLayout>
            {errorMessage && (
                <div style={{ color: 'red', marginBottom: '1rem' }}>
                    {errorMessage}
                </div>
            )}

            {loading ? (
                <div>
                    <p>Loading...</p>
                </div>
            ) : allReportsDone ? (
                <div>
                    <p>No more reports to review</p>
                </div>
            ) : showSuccessfulVoteView ? (
                renderSuccessfulVoteView()
            ) : (
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
                        onClick={() => {handleVote("skip")}}
                        className="btn btn-neutral"
                    >
                        Skip / I don't know
                    </button>
                </div>
            )}
        </ConstrainedLayout>
    )
}

export default ReportReviews;