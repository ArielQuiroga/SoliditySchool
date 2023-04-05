import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <div className="footer">
      <div className='by'>
        <p>by <a href="https://twitter.com/AridevOK" target="_blank" rel="noopener noreferrer">@Aridev</a></p>
        <p> &nbsp; & &nbsp;<a href="https://twitter.com/LeanLabiano" target="_blank" rel="noopener noreferrer">@LeanLabiano</a> </p> 
      </div>
      <p className='getTokens'>Gets Token for mints</p>
    </div>
  );
}

export default Footer;
