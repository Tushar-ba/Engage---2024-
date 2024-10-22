import { useState } from 'react';
import { ethers } from 'ethers';
import MICROLOAN_ABI from './abi.json';
import { MICROLOAN_ADDRESS } from './contractAddress';

const CreateLoanRequest = () => {
  const [collateralToken, setCollateralToken] = useState('');
  const [collateralId, setCollateralId] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [duration, setDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateLoanRequest = async () => {
    try {
      setError('');
      setSuccess('');
      setIsSubmitting(true);

       
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Ethereum wallet.');
      }

       
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No authorized accounts found');
      }

       
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      
      const contract = new ethers.Contract(MICROLOAN_ADDRESS, MICROLOAN_ABI, signer);
      const parsedCollateralId = collateralId; 
      const parsedLoanAmount = ethers.parseUnits(loanAmount, 18); 
      const parsedInterestRate = interestRate; 
      const parsedDuration = duration; 

      console.log("hello")
      const tx = await contract.createLoanRequest(
        collateralToken,
        parsedCollateralId,
        parsedLoanAmount,
        parsedInterestRate,
        parsedDuration
      );

       
      const receipt = await tx.wait();
      setSuccess(`Loan request created successfully! Transaction Hash: ${receipt.transactionHash}`);
    } catch (error) {
      console.error('Error creating loan request:', error);
      setError(error.message || 'Failed to create loan request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Create Loan Request</h1>
      
       
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      
       
      <div className="space-y-4">
        <div>
          <label htmlFor="collateralToken" className="block text-sm font-medium">
            Collateral Token Address
          </label>
          <input
            type="text"
            id="collateralToken"
            value={collateralToken}
            onChange={(e) => setCollateralToken(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            placeholder="Enter token contract address"
          />
        </div>
        <div>
          <label htmlFor="collateralId" className="block text-sm font-medium">
            Collateral Token ID (NFT ID)
          </label>
          <input
            type="number"
            id="collateralId"
            value={collateralId}
            onChange={(e) => setCollateralId(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            placeholder="Enter collateral ID"
          />
        </div>
        <div>
          <label htmlFor="loanAmount" className="block text-sm font-medium">
            Loan Amount (ETH)
          </label>
          <input
            type="text"
            id="loanAmount"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            placeholder="Enter loan amount in ETH"
          />
        </div>
        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium">
            Interest Rate (%)
          </label>
          <input
            type="number"
            id="interestRate"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            placeholder="Enter interest rate as a percentage"
          />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium">
            Duration (seconds)
          </label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            placeholder="Enter loan duration in seconds"
          />
        </div>
        
        {/* Submit Button */}
        <button
          onClick={handleCreateLoanRequest}
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          {isSubmitting ? 'Creating...' : 'Create Loan Request'}
        </button>
      </div>
    </div>
  );
};

export default CreateLoanRequest;