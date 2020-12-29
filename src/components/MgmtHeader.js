import React from "react";
import fudozLogo from '../assets/img/fudoz.jpeg';

const MgmtHeader = props => {
  return (
    <header>
      <div className="container">
        <div className="inline-block text-left" style={{ width: '100%' }}>
          <img src={fudozLogo} alt="fudoz logo" style={{ height: '55px' }}></img>
        </div>
        {/* <div>
          Show logout Button only for certain routes
        </div> */}
      </div>
    </header>
  );
};

export default MgmtHeader;
