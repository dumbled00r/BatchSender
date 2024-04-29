import {useState, useEffect} from 'react';
import { BaseError, useAccount, useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import {ethers} from 'ethers';
import { SUPPORT_CHAIN_IDS } from '../utils/enums';
import { DISPERSE_ADDRESS } from '../utils/constant';
import DisperseABI from '../utils/abi/Disperse.json';
import ERC20 from '../utils/abi/ERC20.json';
import styles from '../styles/SendSection.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SendSection = () => {
    const [amount, setAmount] = useState<string>('');
    const [addresses, setAddresses] = useState<string>('');
    const [transferMode, setTransferMode] = useState<string>('etherSameAmount');
    const chainId = useChainId();
    const address = useAccount();
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
      if (!address) {
        toast.error('Please connect your wallet!');
        return;
      }
      try {
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
      catch (error) {
        toast.error('Something went wrong!');
        return;
      }
    } 

    async function sendEtherDifferentAmount() {
      if (!address) {
        toast.error('Please connect your wallet!', {
          autoClose: 3000
        });
        return;
      }
      try {
      let total = BigInt(0);
      let amountList = amount.split('\n')
      if (amountList.length !== addresses.split('\n').length) {
        toast.error('Addresses and amounts should have same length', {
          autoClose: 3000
        });
        return;
      }
      let amountListFinal = []
      for (let i = 0; i < amountList.length; i++) {
          total += ethers.parseEther(amountList[i]);
          amountListFinal.push(ethers.parseEther(amountList[i]));
      }
      writeContractAsync({ 
        address: `0x${DISPERSE_ADDRESS[chainId].substring(2)}`, 
        abi: DisperseABI, 
        functionName: 'disperseEther', 
        args: [addresses.split('\n'), amountListFinal], 
        chainId: chainId,
        value: total
      }) 
    }
    catch (error) {
      toast.error('Something went wrong!', {
        autoClose: 3000
      });
      return;
    }
  } 
    
    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    }
  ) 
    
    return (
      <>

          <select
            value={transferMode}
            onChange={handleTransferModeChange}
            className={styles.selectbox}
          >
            <option value='etherSameAmount'>Transfer Ether same amount</option>
            <option value='etherDifferentAmount'>Transfer Ether different amount</option>
            <option value='tokenSameAmount'>Transfer Token same amount</option>
            <option value='tokenDifferentAmount'>Transfer Token different amount</option>
          </select>
            {transferMode === 'etherSameAmount' &&             
            <>
                  <textarea
                    name='addresses'
                    value={addresses}
                    placeholder='Enter addresses to send to'
                    onChange={(e) => {
                      setAddresses(e.target.value);
                    } }
                    className={styles.textarea1}>
                    </textarea>
                    <input
                    name='amount'
                    value={amount}
                    placeholder='Enter amount to send'
                    onChange={(e) => {
                      setAmount(e.target.value);
                    } }
                    className={styles.inputbox}>
                    </input>

              <button onClick={sendEtherSameAmount} className={styles['button-3']}>Send</button>
            </>
            }
            {transferMode === 'etherDifferentAmount' &&
            <>
           <div className={styles.container}>
              <textarea
                name='addresses'
                value={addresses}
                placeholder='Enter addresses wallet'
                onChange={(e) => {
                  setAddresses(e.target.value);
                }}
                className={`${styles.textarea} ${styles.addresses}`}
              ></textarea>
              <textarea
                name='amount'
                value={amount}
                placeholder='Enter amount to send'
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                className={`${styles.textarea} ${styles.amount}`}
              ></textarea>
            </div>
            <br></br>
            <button onClick={sendEtherDifferentAmount} className={styles['button-3']}>Send</button>
            </>}

            {hash && <div>Transaction Hash: {hash}</div>} 
            {isConfirming && <div style={{marginTop : '20px', color: 'rgb(173, 216, 230)'}}>Waiting for confirmation...</div>}
            {isConfirmed && <div style={{marginTop : '20px', color: 'rgb(54, 180, 34)'}}>Transaction confirmed.</div>}
            {error && <div style={{color: 'rgb(255, 182, 193)'}}>Error: {(error as BaseError).shortMessage || error.message}</div>}
      {(transferMode === 'tokenSameAmount'|| transferMode === 'tokenDifferentAmount') &&
      <h1>Coming soon...</h1>}
      <ToastContainer
        position="top-center"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"></ToastContainer>
      </>
    )
}

export default SendSection;