import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import MICROLOAN_ABI from './abi.json';
import { MICROLOAN_ADDRESS } from './contractAddress';

const ActiveLoans = () => {
  const [activeLoans, setActiveLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchActiveLoans = async () => {
    try {
      setError('');
      setIsLoading(true);

      // Check if window.ethereum exists
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Ethereum wallet.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No authorized accounts found');
      }

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create contract instance
      const contract = new ethers.Contract(MICROLOAN_ADDRESS, MICROLOAN_ABI, signer);

      // Fetch active loan IDs
      const loanIds = await contract.getActiveLoanRequests();

      // Fetch loan details for each active loan ID
      const loans = await Promise.all(
        loanIds.map(async (loanId) => {
          const loan = await contract.loanRequests(loanId);
          return {
            id: loanId.toString(),
            borrower: loan.borrower,
            collateralToken: loan.collateralToken,
            collateralId: loan.collateralId.toString(), // Convert BigInt to string
            loanAmount: ethers.formatUnits(loan.loanAmount, 18), // Convert BigInt to Ether with formatUnits
            interestRate: loan.interestRate.toString(), // Convert BigInt to string
            duration: loan.duration.toString(), // Convert BigInt to string
            startTime: new Date(Number(loan.startTime) * 1000).toLocaleString(), // Convert BigInt to number for date
            lender: loan.lender === ethers.ZeroAddress ? 'None' : loan.lender,
            isActive: loan.isActive,
            isFunded: loan.isFunded,
            isRepaid: loan.isRepaid,
            isLiquidated: loan.isLiquidated,
          };
        })
      );

      setActiveLoans(loans);
      console.log(loans)
    } catch (error) {
      console.error('Error fetching active loans:', error);
      setError(error.message || 'Failed to fetch active loans');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveLoans();

    // Optional: Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', fetchActiveLoans);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    // Cleanup listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', fetchActiveLoans);
        window.ethereum.removeListener('chainChanged', () => window.location.reload());
      }
    };
  }, []);

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Active Loans</h1>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Active Loans</h1>
      {isLoading ? (
        <div className="animate-pulse">Loading...</div>
      ) : activeLoans.length > 0 ? (
        <ul className="space-y-2">
          {activeLoans.map((loan) => (
            <li key={loan.id} className="p-3 border rounded shadow">
              <div><strong>Loan ID:</strong> {loan.id}</div>
              <div><strong>Borrower:</strong> {loan.borrower}</div>
              <div><strong>Collateral Token:</strong> {loan.collateralToken}</div>
              <div><strong>Collateral ID:</strong> {loan.collateralId}</div>
              <div><strong>Loan Amount:</strong> {loan.loanAmount} ETH</div>
              <div><strong>Interest Rate:</strong> {loan.interestRate}%</div>
              <div><strong>Duration:</strong> {loan.duration} seconds</div>
              <div><strong>Start Time:</strong> {loan.startTime}</div>
              <div><strong>Lender:</strong> {loan.lender}</div>
              <div><strong>Status:</strong> {loan.isRepaid ? 'Repaid' : loan.isLiquidated ? 'Liquidated' : 'Active'}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No active loans available.</p>
      )}
    </div>
  );
};

export default ActiveLoans;
