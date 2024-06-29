import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

function App() {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [amountToSend, setAmountToSend] = useState('');
  const [amountToWithdraw, setAmountToWithdraw] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function connectToMetaMask() {
      try {
        if (typeof window.ethereum !== 'undefined') {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          window.ethereum.on('accountsChanged', (newAccounts) => {
            setAccount(newAccounts[0]);
          });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setConnected(true);
            setAccount(accounts[0]);
            await fetchBalance(accounts[0]);
          }
        } else {
          console.log('Veuillez installer MetaMask pour utiliser cette application.');
        }
      } catch (error) {
        console.error('Erreur de connexion à MetaMask :', error);
      }
    }

    connectToMetaMask();
  }, []);

  async function fetchBalance(account) {
    try {
      const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545'); // Adresse du nœud local Hardhat
      const balance = await provider.getBalance(account);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error('Erreur lors de la récupération de la balance :', error);
    }
  }

  async function sendEther() {
    setError('');
    setSuccess('');
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: '0xF0cBE7b7391d8cE41428Ad4cB5CAFa902EE1D03a', // Remplacez par l'adresse du destinataire
        value: ethers.utils.parseEther(amountToSend)
      });
      await tx.wait();
      setAmountToSend('');
      setSuccess('Transaction envoyée avec succès !');
      await fetchBalance(account);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la transaction :', error);
      setError('Erreur lors de l\'envoi de la transaction.');
    }
  }

  async function withdrawEther() {
    setError('');
    setSuccess('');
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const recipientAddress = '0xBcd4042DE499D14e55001CcbB24a551F3b954096'; // Replace with the address where you want to withdraw the Ether

      // Log the amount to be withdrawn
      console.log(`Amount to withdraw (ETH): ${amountToWithdraw}`);
      const amountInWei = ethers.utils.parseEther(amountToWithdraw);
      console.log(`Amount to withdraw (wei): ${amountInWei.toString()}`);

      // Send transaction to transfer Ether
      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: amountInWei,
      });
      await tx.wait();

      setAmountToWithdraw('');
      setSuccess('Retrait effectué avec succès !');
      await fetchBalance(account);
    } catch (error) {
      console.error('Erreur lors du retrait de l\'ether :', error);
      setError(`Erreur lors du retrait de l'ether : ${error.message}`);
    }
  }

  return (
    <div className="App">
      <h1>Crypto Trading</h1>
      {connected ? (
        <div>
          <p>Connecté avec le compte : {account}</p>
          {balance !== null && <h2><p>Solde : {balance} ETH</p></h2>}
          <div className="wallet_flex">
            <div className="walletG">
              <h3>Envoyer de l'éther</h3>
              <input type='text' placeholder='Montant en Ethers' value={amountToSend} onChange={(e) => setAmountToSend(e.target.value)} />
              <button onClick={sendEther}>Envoyer de l'éther</button>
            </div>
            <div className="walletD">
              <h3>Retirer de l'éther</h3>
              <input type='text' placeholder='Montant en Ethers' value={amountToWithdraw} onChange={(e) => setAmountToWithdraw(e.target.value)} />
              <button onClick={withdrawEther}>Retirer de l'éther</button>
            </div>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
      ) : (
        <p>Non connecté à MetaMask. Veuillez vous connecter pour utiliser l'application.</p>
      )}
    </div>
  );
}

export default App;
