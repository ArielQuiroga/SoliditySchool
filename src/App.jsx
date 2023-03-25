import React from 'react';
import './App.css';
import Button from './Components/Button';
import Header from './Components/Header';
import Footer from './Components/Footer';

function App() {
  return (
    <div className="App">
      <Header className='HeaderApp' />
      <Button />
      <Footer />
    </div>
  );
}

export default App;

