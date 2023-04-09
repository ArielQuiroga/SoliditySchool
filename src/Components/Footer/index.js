import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import FAUCET from "../../Contracts/faucet.json"
import ERC20 from "../../Contracts/erc20.json"

import './Footer.css';

const faucetAddress = "0xce5ab5E6a0Fb7f68Ce46F77e2cdA6Dcb4c6Ea127"
const usdtAddress = "0xe546F483555948084D8Cd3A53e5A53FfD130Be52";

function Footer() {
  let signer;
  let usdtContract;
  const [signerAddress, setSignerAddress] = useState('');
  const [faucetContract, setFaucetContract] = useState('');
  const [tokenBalance, setTokenBalance] = useState('0.0');
  // const [usdtContract, setUsdtContract] = useState('')

  useEffect(() => {
    createSigner();
  }, []);

  const createSigner = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (window.ethereum.selectedAddress) {
        await initContract();
        setSignerAddress(await signer.getAddress());
        await getTokenBalance();
      }
    }
  };

  const initContract = async () => {
    const provider = await new ethers.providers.Web3Provider(window.ethereum);
    signer = await provider.getSigner();
    const faucetContract = new ethers.Contract(faucetAddress, FAUCET, signer);
    usdtContract = new ethers.Contract(usdtAddress, ERC20, signer);  
    setFaucetContract(faucetContract);
  }

  const getTokenBalance = async () => {
    initContract();
    const balance = await usdtContract.balanceOf(signer.getAddress());
    console.log('Token balance:',ethers.utils.formatEther(balance.toString()))
    setTokenBalance(ethers.utils.formatEther(balance.toString()))
  
  }

  const claimTokens = async () => {
    initContract();
    const tx = await faucetContract.claimTokens({gasLimit: 300000});
    await tx.wait().then( async () => {
      await getTokenBalance();
    })
  }


  return (
    <div className="footer">
      <div className='by'>
        <p>by <a href="https://twitter.com/AridevOK" target="_blank" rel="noopener noreferrer">@Aridev</a></p>
        <p> &nbsp; & &nbsp;<a href="https://twitter.com/LeanLabiano" target="_blank" rel="noopener noreferrer">@LeanLabiano</a> </p> 
      </div>

      <p className='getTokens' >
        {tokenBalance  === '0.0'
        ? <button onClick={claimTokens}> Clik HERE to claim tokens</button>
        : 'Tokens in wallet: ' + tokenBalance  
        }
      </p>
    </div>
  );
}

export default Footer;
