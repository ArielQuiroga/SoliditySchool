import React, { useEffect, useState } from 'react';
import './button.css';
import { ethers } from 'ethers';
import ERC20 from "../../Contracts/erc20.json"
import ERC721 from "../../Contracts/erc721.json"

// Debe estar apuntando a polygon testnet
const usdtAddress = "0xe546F483555948084D8Cd3A53e5A53FfD130Be52";
const nftAddress = "0xaf2665415aee6ab41370003ca51c3fda5494d585"
const usdtABI = ERC20;
const nftABI = ERC721;

function Button() {
  let signer;
  let usdtContract;
  let nftContract;
  const [approveText, setApproveText] = useState('Approve');
  const [isConnected, setIsConnected] = useState(false); // Agrega un estado para controlar si está conectado a MetaMask
  const [isApproved, setIsApproved] = useState('');
  const [message, setMessage] = useState('');

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
    console.log("Allowance: ", ethers.utils.formatEther(allowance.toString()))
    if(allowance > ethers.utils.formatEther(1)){
      setIsApproved(true);
    }else{
      setIsApproved(false);
    }
  }

  const mint = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      await initContract();     
      console.log(message);
      const tx = await nftContract.safeMint(signer.getAddress(),message, {gasLimit: 300000});
    } catch (error) {
      console.error(error);
    }
  }

  const handleMessage = (event) => {
    setMessage(event.target.value);
    console.log(message);
  };
  
  return (
    <div className="button-div">
      <div className='button-container'>   
      {isConnected 
        ? (isApproved 
            ? <form onSubmit={mint} className='form-button'>
                <input className='registroInputs' type="text" id="Message" name="Message" value={message} onChange={handleMessage} placeholder='Mensaje aqui' />
                {message === "" ? (
                  <button className='myboton' type="button" disabled> MINT </button>
                 ) : (
                  <button className='myboton' type="button" onClick={mint}> MINT </button>
                )}
              </form>
            : <button  className='myboton'  onClick={approveTokens}> {approveText} </button>
          )
        : <button className='myboton' onClick={connectWallet}>CONNECT</button>
      }
      </div>
    </div>
  );
}

export default Button;

