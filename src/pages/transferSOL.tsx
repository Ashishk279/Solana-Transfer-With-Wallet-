import { useConnection, useWallet  } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import React, {useState, FC} from 'react'
import Spinner from '../components/spinner';


const TransferSOL:FC= () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [recipient, setRecipient] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    console.log(recipient, amount, publicKey)

    const SendSOLTransaction = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!publicKey) {
            alert("Wallet not connected!");
            return 0;
        }

        try {
            setLoading(true)
            const balance = await connection.getBalance(publicKey)
            if(balance < amount){
              alert(`Insufficient balance:${ balance }`)
              return 0;
            }
            console.log("Balance: ", balance)
            const recipentPublicKey = new PublicKey(recipient.toString());
          
            // Create new Transaction
            const transaction = new Transaction();
            
            const sendSOLTransaction = SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: recipentPublicKey,
                lamports: amount * LAMPORTS_PER_SOL
            })

            transaction.add(sendSOLTransaction);

            // Send the Transaction
            const signature = await sendTransaction(transaction, connection)
            alert(`Transaction successful! Signature: ${signature}`);
        } catch (error) {
            alert(`Transaction failed ${error}`);
            alert('Transaction failed. Please check the console for more details.');
        }finally {
          setLoading(false);
        }
    }
    return (
        <div style={{display:'flex', justifyContent:'center'}}>
        <form onSubmit={SendSOLTransaction} style={{ marginTop: '20px', border: '2px solid black', borderRadius: '24px', padding:'12px 0px', width: '40rem', justifyContent:'center' }}>
        <div>
          <label>Recipient Address:</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Recipient Address"
            required
            style={{ margin: '10px 0', padding: '8px', width: '300px' }}
          />
        </div>
        <div>
          <label>Amount (SOL):</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            placeholder="Amount in SOL"
            required
            style={{ margin: '10px 0', padding: '8px', width: '300px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {loading ? <Spinner/> : "Send SOL"}
        </button>
      </form>
      </div>
    )
}

export default TransferSOL