import React from "react";
import PropTypes from "prop-types";
import ConstrainedLayout from "../../shared/ConstrainedLayout";

const GameLayout = ({
  mainContent,
  sideContent = null,
  showSidePanel = true,
  showProgressBar = false,
  gameOver = false,
  progressBarHeight = 56
}) => {
  const topMargin = showProgressBar ? `${progressBarHeight + 16}px` : '0px';

  return (
    <div className="container-fluid mt-0 px-0">
      <div className="row justify-content-center gx-0">
        {/* Main content - full width on mobile, constrained on desktop */}
        <div className={showSidePanel ? "col-12 col-lg-8 px-0 px-md-3" : "col-12 col-xl-10 px-0 px-md-3"}>
          <div
            className={`d-flex justify-content-center ${!gameOver ? 'align-items-center' : ''}`}
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
        
        {/* Side panel - hidden on mobile, visible on desktop */}
        {showSidePanel && (
          <div
            className="col-12 col-lg-4 col-xl-3 d-none d-lg-block px-md-3"
            style={{
              overflowY: 'auto',
              overflowX: 'hidden',
              marginTop: '1rem'
            }}
          >
            {sideContent}
          </div>
        )}
        
        {/* Mobile side panel - show below main content on mobile */}
        {showSidePanel && (
          <div className="col-12 d-lg-none mt-3 px-0 px-md-3">
            <div className="row gx-0">
              <div className="col-12">
                <h6 className="text-center mb-3">Game Progress</h6>
                {sideContent}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

GameLayout.propTypes = {
  mainContent: PropTypes.node.isRequired,
  sideContent: PropTypes.node,
  showSidePanel: PropTypes.bool,
  showProgressBar: PropTypes.bool,
  gameOver: PropTypes.bool,
  progressBarHeight: PropTypes.number
};

export default GameLayout;
