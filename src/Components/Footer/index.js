import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import FAUCET from "../../Contracts/faucet.json"
import ERC20 from "../../Contracts/erc20.json"

import './Footer.css';

const faucetAddress = "0x58F8613AF9B062FEb94839fc64570476099766D0"
const usdtAddress = "0xa4eF9925feBFdAdE42e6f444B9fF414134eD2695";

function Footer() {
  let signer;
  let usdtContract;
  const [chainId, setChainID] = useState('');
  const [signerAddress, setSignerAddress] = useState('');
  const [faucetContract, setFaucetContract] = useState('');
  const [tokenBalance, setTokenBalance] = useState('0.0');
  // const [usdtContract, setUsdtContract] = useState('')

  useEffect(() => {
    createSigner();
    if(window.ethereum){
      window.ethereum.on('chainChanged', handleChainChanged); // Agrega el event listener al cargar el componente
    }else{
      console.log("metamask no instalado");
    }
    
  }, []);

  const createSigner = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (window.ethereum.selectedAddress) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log(chainId.toString());
        if (chainId === '0x89') { // Polygon MAINET chain ID
          await initContract();
          setSignerAddress(await signer.getAddress());
          await getTokenBalance();
          setChainID(chainId);
        } else {
          alert('Por favor, cambia a la red de Polygon');
        } 
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

  useEffect(() => {
    if(chainId && chainId !== '0x89') { // Verifica si el chainId es diferente a Mumbai Testnet
      console.log(`Cambió de red: ${chainId}`);
      alert('Debes estar en la red de Polygon');
    }
  }, [chainId]);

  const handleChainChanged = (chainId) => {
    setChainID(chainId);
  }

  return (
    <div className="footer">
      <div className='by'>
        <p>by <a href="https://twitter.com/AridevOK" target="_blank" rel="noopener noreferrer">@Aridev</a></p>
        <p> &nbsp; & &nbsp;<a href="https://twitter.com/LeanLabiano" target="_blank" rel="noopener noreferrer">@LeanLabiano</a> </p> 
      </div>
      {chainId != '0x89'
        ? <p className='Alert-badred'> Debes estar en la red de Polygon</p>
        : ""
      }

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
