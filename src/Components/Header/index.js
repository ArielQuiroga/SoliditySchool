import React from 'react';
import './Header.css';

function Header(props) {
  return (
    <div className={`header ${props.className}`}>
      <h1 className='h1header'>Mad Crypto solidity School</h1>
    </div>
  );
}

export default Header;
