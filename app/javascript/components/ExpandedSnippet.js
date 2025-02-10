import React from 'react';

function ExpandedSnippet({ snippet, game_session_id, onSubmit, onNext }) {
  const handleSuccess = () => {
    onSubmit(snippet.id, true);
  };

  const handleFailure = () => {
    onSubmit(snippet.id, false);
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="expanded-snippet">

        <div className="lyric-box">
          <p>
            {snippet.snippet}
          </p>
        </div>

        <div className="image-box">
          <div className="square-image-container">
            <img
              src={snippet.image_url}
              alt={`${snippet.song} Album Cover`}
              className="album-cover"
            />
          </div>
        </div>

        <div className="button-box">
            {game_session_id ? (
              <>
                <button className="button-fancy button-fancy-success" onClick={handleSuccess}>
                  Snuck it in! 😎
                </button>
                <button className="button-fancy button-fancy-fail" onClick={handleFailure}>
                  Got caught! 😅
                </button>
              </>
            ) : (
              <button className="button-fancy" onClick={handleNext}>
                Next 🤓
              </button>
            )}
        </div>

        <div className="info-box">
            <p className="mb-1">{snippet.song}</p>
            <p className="mb-1">{snippet.artist}</p>
            <p className="mb-1">Points: {snippet.difficulty}</p>
        </div>


      {/* <div className="row h-100">

        <div className="col d-flex flex-column">
          <div className="card-body lyric-box overflow-auto">
          </div>
          <div className="mt-auto">
          </div>
        </div>

        <div
          className="col-auto d-flex flex-column h-100" style={{ width: "min-content" }}>
          <div className="text-right p-2 mt-auto" style={{ fontSize: ".9rem" }}>
          </div>
        </div>
      </div> */}

    </div>
  );
}

export default ExpandedSnippet;
