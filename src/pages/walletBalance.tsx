import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import React, { useState, useEffect, FC } from 'react'
const WalletBalance: FC = () => {
  const { connection } = useConnection()
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number>(0);


  console.log(balance, connection, publicKey)
  const updateBalance = async () => {
    if (!connection || !publicKey) {
      console.log("Wallet not connected or connection unavailable");
      return
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
    <div>
      {publicKey ? (
        <div>
          <p>Connected Address: {publicKey.toBase58()}</p>
          <p>Balance: ${balance} SOL</p>
        </div>
      ) : (
        <p>No wallet connected</p>
      )}
    </div>
  )
}

export default WalletBalance