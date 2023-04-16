import React, { useEffect, useState } from 'react';
import ERC721 from "../../Contracts/erc721.json"
import { ethers } from 'ethers';
import './view.css';

const nftAddress = "0xEf85A404cfE4eB75F6d82eA7bC67C934906bC19B"
const nftABI = ERC721;

function View() {
  let signer;
  let nftContract;
  const [signerAddress, setSignerAddress] = useState('');
  const [messageSigner, setMessageSigner] = useState('');
  const [messageID, setMessageID] = useState('HOlA');
  const [id, setId] = useState('');

  useEffect(() => {
    createSigner();
    if (window.ethereum ) {
      window.ethereum.on('accountsChanged', (accounts) => {
        console.log('cambio de wallet');
        window.location.reload();
      });
    }
  }, []);

  const createSigner = async () => {
    if (window.ethereum ) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (window.ethereum.selectedAddress) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          signer = await provider.getSigner();
          await initContract();
          await getMessageSigner();
          setSignerAddress(await signer.getAddress());
        }
      }
  };

  const initContract = async () => {
    nftContract = new ethers.Contract(nftAddress, nftABI, signer);    
  }

  const getMessageSigner = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      await initContract();  

      const tokenId = await nftContract.tokensOfOwner(signer.getAddress());
      const message = await nftContract.messages(tokenId.toString());
      setMessageSigner(message);
    } catch (error) {
      console.error(error);
    }
  }
  const getMessageID = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      await initContract();  

      const message = await nftContract.messages(id.toString());
      setMessageID(message.toString());
    } catch (error) {
      console.error(error);
    }
  }

  const handleMessage = (event) => {
    setId(event.target.value);
  };

  return (
    <div className="View">
        <div>
          <h3> {signerAddress}</h3>
          <p className='label-view'>You Message: {messageSigner}</p>
        </div>
        <div className='div-view-get-section'>
            <input className='input-view' type="text" id="Message" name="Message" value={id} onChange={handleMessage} placeholder='Mensaje aqui' />
            <button className='button-view' onClick={getMessageID}>Get message</button>
            <label className='label-view' >{messageID}</label>
        </div>
    </div>
  );
}

export default View;
