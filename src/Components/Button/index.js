import React, { useEffect, useState } from 'react';
import './Button.css';
import { ethers } from 'ethers';
import ERC20 from "../../Contracts/erc20.json"
import ERC721 from "../../Contracts/erc721.json"

// Debe estar apuntando a polygon testnet
const usdtAddress = "0xeacdbbfF5808024828D47FCBeaED8Dd2fAfe4A75";
const nftAddress = "0x07932903Fcf32802ff951ed75b029821A7dCC8c7"
const usdtABI = ERC20;
const nftABI = ERC721;

function Button() {
  let signer;
  let usdtContract;
  let nftContract;
  const [approveText, setApproveText] = useState('Approve');
  const [isConnected, setIsConnected] = useState(false); // Agrega un estado para controlar si está conectado a MetaMask
  const [isApproved, setIsApproved] = useState('');

  const initContract = async () => {
    usdtContract = new ethers.Contract(usdtAddress, usdtABI, signer);
    nftContract = new ethers.Contract(nftAddress, nftABI, signer);    
  }

  useEffect(() => {
    connectWallet()
  }, [])
  
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Conectado a MetaMask');
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        await initContract();
        allowanceTokens();
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
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        await initContract();

        const tx = await usdtContract.approve( nftAddress, '9999000000000000000000', {
          gasLimit: 300000,
        });
        setApproveText('Approving...')

        await tx.wait().then(() =>{
          setApproveText('Approve');
        })

        console.log(tx);
        setIsApproved(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Necesitas conectarte a MetaMask primero');
    }
  };

  const allowanceTokens = async () => {
    const allowance = await usdtContract.allowance(signer.getAddress(), nftAddress );
    if(allowance > ethers.utils.formatEther(1)){
      setIsApproved(true);
    }else{
      setIsApproved(false);
    }
  }

  // const mint = async () => {
    // console.log('hola');
  // }

  const mint = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      await initContract();     
      const tx = await nftContract.safeMint(signer.getAddress(), {gasLimit: 300000});
  
      await tx.wait();
  
      console.log(tx);
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <div className="App">
      <div className='container'>   

        <button className='myboton' onClick={
          isConnected 
          ? (isApproved ? mint : approveTokens) 
          : connectWallet 
        }>
          <p className='buttontext'>{isConnected ? (isApproved ? 'Mint' : approveText) : 'Connect to wallet'}</p> 
        </button>

      </div>
    </div>
  );
}

export default Button;

