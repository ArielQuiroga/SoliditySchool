import React, { useState } from 'react';
import './Button.css';
import { ethers } from 'ethers';
import ERC20 from "../../Contracts/erc20.json"
import { isContentEditable } from '@testing-library/user-event/dist/utils';


function Button() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const usdtABI = ERC20;
  let usdtContract = new ethers.Contract(usdtAddress, usdtABI, provider);
  const [isConnected, setIsConnected] = useState(false); // Agrega un estado para controlar si está conectado a MetaMask
  const [isApproved, setIsApproved] = useState(false);
  let signer;

  //  async function balance() {
  //    const balance = await usdtContract.balanceOf('0x82E1d4DDd636857Ebcf6a0e74B9b0929C158D7FB');
  //    console.log (balance.toString())
  //  }
  //  balance();

  const checkConnectState = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      signer = provider.getSigner();
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
        const tx = await usdtContract.approve( '0x53c902139D9C95a19E809CA39E46269b04739740', 1);
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

