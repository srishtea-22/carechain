import { useState } from 'react';
import { ethers } from 'ethers';

export default function useWallet() {
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async (): Promise<void> => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner(); 
      const userAddress = await signer.getAddress(); 
      setAddress(userAddress);
    } catch (err) {
      console.error('Error connecting wallet:', err);
    }
  };

  const signMessage = async (message: string): Promise<string | null> => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return null;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);
      return signature;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return { address, connectWallet, signMessage };
}