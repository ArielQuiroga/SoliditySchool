import React, { useEffect, useRef, useState } from 'react';
import ERC721 from "../../Contracts/erc721.json";
import { ethers } from 'ethers';
import './SlideText.css';

const nftAddress = "0x68f9cda82c1108d936dba31e2b2a1e33a736a578"

function SlideText() {
  let signer;
  let nftContract;
  const [messages, setMessages] = useState([]);

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
        await getMessage();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('MetaMask no está instalado');
    }
  };

  const initContract = async () => {
    nftContract = new ethers.Contract(nftAddress, ERC721, signer);    
  }

  // const messages = 
  //   ["Este es un mensaje de testeo",
  //    "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  //    "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s", 
  //    "Increible"
  //   ];

  const getMessage = async () => {
    const totalSupply = await nftContract.totalSupply();
    const messageCount = Math.min(totalSupply, 10); // Obtener los mensajes de los últimos 10 NFT
    const newMessages = [];
    for (let i = totalSupply - 1; i >= totalSupply - messageCount; i--) {
      const message = await nftContract.messages(i);
      newMessages.push(message);
      console.log(message.toString())
    }
    setMessages(newMessages);
  }
    
  const messagesRef = useRef(null);

  useEffect(() => {
    let concatenatedMessages = '';
    messages.forEach((message, index) => {
      concatenatedMessages += message + (index !== messages.length - 1 ? '<span>|</span>' : '');
    });
    concatenatedMessages = ' ' + concatenatedMessages;
    messagesRef.current.innerHTML = concatenatedMessages;
    const duration = concatenatedMessages.length / 4 ;
    messagesRef.current.style.animationDuration = duration + 's';
  }, [messages]);

  return (
    <div className="slide-text-container">
      <div className="slide-text" ref={messagesRef}></div>
    </div>
  );
}

export default SlideText;
