import { useState } from 'react';
import { ethers } from 'ethers';
import MICROLOAN_ABI from './abi.json';
import { MICROLOAN_ADDRESS } from './contractAddress';

const RepayLoan = () => {
  const [loanId, setLoanId] = useState('');
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRepayLoan = async () => {
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
      const parsedLoanId = loanId; // Parse the loan ID
      const parsedRepaymentAmount = ethers.parseUnits(repaymentAmount, 18); // Convert ETH to Wei

      const tx = await contract.repayLoan(parsedLoanId, {
        value: parsedRepaymentAmount,
      });

      const receipt = await tx.wait();
      setSuccess(`Loan repaid successfully! Transaction Hash: ${receipt.transactionHash}`);
    } catch (error) {
      console.error('Error repaying loan:', error);
      setError(error.message || 'Failed to repay loan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Repay Loan</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <div className="space-y-4">
        <div>
          <label htmlFor="loanId" className="block text-sm font-medium">
            Loan ID
          </label>
          <input
            type="number"
            id="loanId"
            value={loanId}
            onChange={(e) => setLoanId(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            placeholder="Enter loan ID"
            required
          />
        </div>
        <div>
          <label htmlFor="repaymentAmount" className="block text-sm font-medium">
            Repayment Amount (ETH)
          </label>
          <input
            type="text"
            id="repaymentAmount"
            value={repaymentAmount}
            onChange={(e) => setRepaymentAmount(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            placeholder="Enter repayment amount in ETH"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleRepayLoan}
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          {isSubmitting ? 'Repaying...' : 'Repay Loan'}
        </button>
      </div>
    </div>
  );
};

export default RepayLoan;
