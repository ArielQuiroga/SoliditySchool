import React from 'react';
import './Header.css';
import SlideText from '../SlideText';

function Header(props) {
  return (
    <div className={`header ${props.className}`}>
      <SlideText/>
      <h1 className='h1header'>Solidity School</h1>
    </div>
  );
}

export default Header;
