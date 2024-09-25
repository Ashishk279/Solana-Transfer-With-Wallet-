import '@solana/wallet-adapter-react-ui/styles.css';
import { ConnectionProvider, useConnection, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

import { clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import React, { useEffect, useMemo, useState } from 'react'
import './App.css';
import TransferSOL from './pages/transferSOL';
import { Buffer } from 'buffer';
import WalletBalance from './pages/walletBalance';

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [], []);
  const { connection } = useConnection()
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    window.Buffer = Buffer; // Make Buffer globally available
  }, []);

  console.log(balance)
  const updateBalance = async () => {
    if (!connection || !publicKey) {
      console.error("Wallet not connected or connection unavailable");
    }

    try {
      const balance = await connection.getBalance(publicKey as PublicKey)
      console.log(balance)
      setBalance(balance / LAMPORTS_PER_SOL)
    } catch (error) {
      console.error("Failed to retrieve account info:", error);
    }
  };
  useEffect(() => {
    updateBalance()
  }, [publicKey, connection])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} >
        <WalletModalProvider>
          <div className="App">
            <h1>Connect Solana Wallet</h1>
            <WalletMultiButton />
           <WalletBalance/>
            <TransferSOL />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
