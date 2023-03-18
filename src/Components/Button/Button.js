import React, { useState } from 'react';
import './button.css';
import { ethers } from 'ethers';


function App() {
  const [isConnected, setIsConnected] = useState(false); // Agrega un estado para controlar si está conectado a MetaMask

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Conectado a MetaMask');
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setIsConnected(true); // Actualiza el estado
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('MetaMask no está instalado');
    }
  };

  return (
    <div className="App">
      <div className='container'>
        <button className='myboton' onClick={connectWallet}>
          <p className='buttontext'>{isConnected ? 'Approve' : 'Connect to wallet'}</p> 
        </button>     
      </div>
    </div>
  );
}

export default App;
