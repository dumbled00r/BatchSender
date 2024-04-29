import {useState, useEffect} from 'react';
import { BaseError, useAccount, useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import {ethers} from 'ethers';
import { SUPPORT_CHAIN_IDS } from '../utils/enums';
import { DISPERSE_ADDRESS } from '../utils/constant';
import DisperseABI from '../utils/abi/Disperse.json';
import styles from '../styles/Home.module.css';

const SendSection = () => {
    const [amount, setAmount] = useState<string>('');
    const [addresses, setAddresses] = useState<string>('');
    const [transferMode, setTransferMode] = useState<string>('etherSameAmount');
    const chainId = useChainId();

    const { 
        data: hash,    
        error, 
        writeContractAsync } = useWriteContract();
    
    const handleTransferModeChange = (event: {
      target: { value: React.SetStateAction<string>; };
    }) => {
      setTransferMode(event.target.value);
    }

    async function sendEtherSameAmount() {
        let total = BigInt(0);
        let amountList = [];
        for (let i = 0; i < addresses.split('\n').length; i++) {
            amountList.push(ethers.parseEther(amount));
            total += ethers.parseEther(amount);
        }
        writeContractAsync({ 
          address: `0x${DISPERSE_ADDRESS[chainId].substring(2)}`, 
          abi: DisperseABI, 
          functionName: 'disperseEther', 
          args: [addresses.split('\n'), amountList], 
          chainId: chainId,
          value: total
        }) 
      } 
    
    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    }) 

    return (
      <>
            <div>
              <select
                value={transferMode}
                onChange={handleTransferModeChange}
                className={styles.select}
                >
                <option value='etherSameAmount'>Transfer Ether Same Amount</option>
                <option value='etherDifferentAmount'>Transfer Ether Different Amount</option>
                <option value='tokenSameAmount'>Transfer Token Same Amount</option>
                <option value='tokenDifferentAmount'>Transfer Token Different Amount</option>
              </select>
            </div>
            <input 
                name='amount'
                value={amount}
                placeholder='Enter amount to send'
                onChange={(e) => {
                setAmount(e.target.value)}}></input>
            <textarea 
                name='addresses'
                value={addresses}
                placeholder='Enter addresses to send to'
                onChange={(e) => {setAddresses(e.target.value);
                }}></textarea>
            <br></br>
            <button onClick={sendEtherSameAmount}>Send</button>
            {hash && <div>Transaction Hash: {hash}</div>} 
            {isConfirming && <div>Waiting for confirmation...</div>} 
            {isConfirmed && <div>Transaction confirmed.</div>} 
            {error && ( 
        <div>Error: {(error as BaseError).shortMessage || error.message}</div> 
      )} 
        </>
    )
}

export default SendSection;