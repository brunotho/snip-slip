import React from "react";
import ConstrainedLayout from "../../shared/ConstrainedLayout";
import GameProgressBar, { calculateProgressBarHeight } from "../display/GameProgressBar";

const GameLayout = ({
  mainContent,
  showProgressBar = false,
  progressBarPlayers = {},
  currentUserId = null,
  isMultiplayer = false,
  progressBarLoading = false
}) => {
  const progressBarHeight = showProgressBar ? calculateProgressBarHeight(Object.keys(progressBarPlayers).length) : 0;
  const topMargin = showProgressBar ? `${progressBarHeight}px` : '0px';

  return (
    <>
      {showProgressBar && (
        <GameProgressBar 
          players={progressBarPlayers}
          currentUserId={currentUserId}
          isMultiplayer={isMultiplayer}
          loading={progressBarLoading}
        />
      )}
      <div className="container-fluid mt-0 px-0">
        <div className="row justify-content-center gx-0">
          <div className="col-12 col-xl-10 px-0 px-md-3">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                marginTop: topMargin,
                paddingTop: '0',
                width: '100%'
              }}
            >
              <ConstrainedLayout>
                {mainContent}
              </ConstrainedLayout>
            </div>
          </div>

          {/* TODO: Desktop side panel - re-enable later
          <div className="col-12 col-lg-4 col-xl-3 d-none d-lg-block px-md-3">
            {sideContent}
          </div>
          
          <div className="col-12 d-lg-none mt-3 px-0 px-md-3">
            <div className="row gx-0">
              <div className="col-12">
                <h6 className="text-center mb-3">Game Progress</h6>
                {sideContent}
              </div>
            </div>
          </div>
          */}
        </div>
      </div>
    </>
  );
};

export default GameLayout;
