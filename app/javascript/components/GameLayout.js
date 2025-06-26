import React from "react";
import PropTypes from "prop-types";

const GameLayout = ({
  mainContent,
  sideContent = null,
  showSidePanel = true,
  gameOver = false
}) => {
  return (
    <div className="container-fluid mt-2 mt-md-4">
      <div className="row justify-content-center">
        {/* Main content - full width on mobile, constrained on desktop */}
        <div className={showSidePanel ? "col-12 col-lg-8" : "col-12 col-xl-10"}>
          <div
            className={`d-flex justify-content-center ${!gameOver ? 'align-items-center' : ''}`}
            style={{
              overflow: 'hidden',
              marginTop: '0',
              paddingTop: '0.5rem'
            }}
          >
            {mainContent}
          </div>
        </div>
        
        {/* Side panel - hidden on mobile, visible on desktop */}
        {showSidePanel && (
          <div
            className="col-12 col-lg-4 col-xl-3 d-none d-lg-block"
            style={{
              overflowY: 'auto',
              overflowX: 'hidden',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              marginTop: '1rem'
            }}
          >
            {sideContent}
          </div>
        )}
        
        {/* Mobile side panel - show below main content on mobile */}
        {showSidePanel && (
          <div className="col-12 d-lg-none mt-3">
            <div className="row">
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
  gameOver: PropTypes.bool
};

export default GameLayout;
