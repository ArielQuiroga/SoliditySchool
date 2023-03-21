import React, { useState } from 'react';
import './Button.css';
import { ethers } from 'ethers';
import ERC20 from "../../Contracts/erc20.json"
import { isContentEditable } from '@testing-library/user-event/dist/utils';

const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const usdtABI = ERC20;

function Button() {
  let provider ;
  let signer;
  let usdtContract;
  const [isConnected, setIsConnected] = useState(false); // Agrega un estado para controlar si está conectado a MetaMask
  const [isApproved, setIsApproved] = useState(false);

  const initContract = async () => {
    usdtContract = new ethers.Contract(usdtAddress, usdtABI, signer);
    
  }

  const checkConnectState = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      await initContract();
      setIsConnected(true);
    }
  }
  checkConnectState();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Conectado a MetaMask');
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        await initContract();
        setIsConnected(true); // Actualiza el estado
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('MetaMask no está instalado');
    }
  };

  const approveTokens = async () => {
    if (isConnected) {
      try {
        const tx = await usdtContract.approve( signer.getAddress(), 1);
        console.log(tx);
        setIsApproved(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Necesitas conectarte a MetaMask primero');
    }
  };


  return (
    <div className="App">
      <div className='container'>
        <button className='myboton' onClick={isConnected ? approveTokens : connectWallet }>
          <p className='buttontext'>{isConnected ? 'Approve' : 'Connect to wallet'}</p> 
        </button>     
      </div>
    </div>
  );
}

export default Button;

