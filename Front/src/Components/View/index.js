import React, { useEffect, useState } from 'react';
import ERC721 from "../../Contracts/erc721.json"
import { ethers } from 'ethers';
import './view.css';

const nftAddress = "0x68f9cda82c1108d936dba31e2b2a1e33a736a578"
const nftABI = ERC721;

// const usdtAddress = "0xe546F483555948084D8Cd3A53e5A53FfD130Be52";

function View() {
  let signer;
  let nftContract;
  const [signerAddress, setSignerAddress] = useState('');
  const [messageSigner, setMessageSigner] = useState('');
  const [messageID, setMessageID] = useState('');

  useEffect(() => {
    createSigner();
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
      console.log("Message: ", message);
      setMessageSigner(message);
    } catch (error) {
      console.error(error);
    }
  }

  const handleMessage = (event) => {
    // console.log(message);
  };

  return (
    <div className="View">
        <div>
          <h3> {signerAddress}</h3>
          <p>Message: {messageSigner}</p>
        </div>
        <div>
            <input className='getId' type="text" id="Message" name="Message" value={messageID} onChange={handleMessage} placeholder='Mensaje aqui' />
            <button onClick={getMessageSigner}>Get message</button>
            <label>Mensaje pedido</label>
        </div>
    </div>
  );
}

export default View;
