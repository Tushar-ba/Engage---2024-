import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ABI from "./ABI.json";

const contractABI = ABI;
const contractAddress = "0x198c6481a86933cF2E76fD2A9764bA5435ad47Aa";

function MicroLoanPlatform() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [activeLoans, setActiveLoans] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [createLoanForm, setCreateLoanForm] = useState({
    collateralToken: "",
    collateralId: "",
    loanAmount: "",
    interestRate: "",
    duration: ""
  });

  const [platformFee, setPlatformFee] = useState("");


    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(contractAddress, contractABI, signer);

          setProvider(provider);
          setContract(contract);
          setAccount(await signer.getAddress());

          loadActiveLoans(contract);
          
          window.ethereum.on("accountsChanged", handleAccountChange);
        } catch (error) {
          setError("Error connecting to wallet");
        }
      } else {
        setError("Please install MetaMask!");
      }
    };
init()
 

  const handleAccountChange = async (accounts) => {
    if (accounts.length > 0) {
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      const newSigner = newProvider.getSigner();
      setAccount(accounts[0]);
      setContract(new ethers.Contract(contractAddress, contractABI, newSigner));
    } else {
      setAccount("");
    }
  };

  const loadActiveLoans = async (contractInstance) => {
    try {
      const loans = await contractInstance.getActiveLoanRequests();
      const loansDetails = await Promise.all(
        loans.map(async (loanId) => {
          const loan = await contractInstance.loanRequests(loanId);
          return { id: loanId, ...loan };
        })
      );
      setActiveLoans(loansDetails);
      console.log(loansDetails);
    } catch (error) {
      setError("Error loading active loans");
      console.error(error);
    }
  };

  const handleCreateLoan = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      const tx = await contract.createLoanRequest(
        createLoanForm.collateralToken,
        createLoanForm.collateralId,
        ethers.utils.parseEther(createLoanForm.loanAmount),
        createLoanForm.interestRate,
        createLoanForm.duration,
        { gasLimit: 3000000 }
      );
      await tx.wait();
      setSuccess("Loan request created successfully!");
      loadActiveLoans(contract);
      setCreateLoanForm({
        collateralToken: "",
        collateralId: "",
        loanAmount: "",
        interestRate: "",
        duration: ""
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFundLoan = async (loanId, amount) => {
    setError("");
    setSuccess("");
    try {
      const tx = await contract.fundLoan(loanId, {
        value: ethers.utils.parseEther(amount.toString())
      });
      await tx.wait();
      setSuccess("Loan funded successfully!");
      loadActiveLoans(contract);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRepayLoan = async (loanId, amount) => {
    setError("");
    setSuccess("");
    try {
      const tx = await contract.repayLoan(loanId, {
        value: ethers.utils.parseEther(amount.toString())
      });
      await tx.wait();
      setSuccess("Loan repaid successfully!");
      loadActiveLoans(contract);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLiquidateLoan = async (loanId) => {
    setError("");
    setSuccess("");
    try {
      const tx = await contract.liquidateLoan(loanId);
      await tx.wait();
      setSuccess("Loan liquidated successfully!");
      loadActiveLoans(contract);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSetPlatformFee = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const tx = await contract.setPlatformFee(platformFee);
      await tx.wait();
      setSuccess("Platform fee updated successfully!");
      setPlatformFee("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleWithdrawFees = async () => {
    setError("");
    setSuccess("");
    try {
      const tx = await contract.withdrawFees();
      await tx.wait();
      setSuccess("Fees withdrawn successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Microloan Platform</h1>
      
      {account && <p>Connected Account: {account}</p>}
      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
      {success && <div style={{ color: 'green', margin: '10px 0' }}>{success}</div>}

      <div style={{ marginBottom: '20px' }}>
        <h2>Create Loan Request</h2>
        <form onSubmit={handleCreateLoan}>
          <div>
            <input
              type="text"
              placeholder="Collateral Token Address"
              value={createLoanForm.collateralToken}
              onChange={(e) => setCreateLoanForm({
                ...createLoanForm,
                collateralToken: e.target.value
              })}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Collateral ID"
              value={createLoanForm.collateralId}
              onChange={(e) => setCreateLoanForm({
                ...createLoanForm,
                collateralId: e.target.value
              })}
            />
          </div>
          <div>
            <input
              type="number"
              step="0.01"
              placeholder="Loan Amount (ETH)"
              value={createLoanForm.loanAmount}
              onChange={(e) => setCreateLoanForm({
                ...createLoanForm,
                loanAmount: e.target.value
              })}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Interest Rate (%)"
              value={createLoanForm.interestRate}
              onChange={(e) => setCreateLoanForm({
                ...createLoanForm,
                interestRate: e.target.value
              })}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Duration (seconds)"
              value={createLoanForm.duration}
              onChange={(e) => setCreateLoanForm({
                ...createLoanForm,
                duration: e.target.value
              })}
            />
          </div>
          <button type="submit">Create Loan Request</button>
        </form>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Active Loans</h2>
        {activeLoans.map((loan) => (
          <div key={loan.id.toString()} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <p>Loan ID: {loan.id.toString()}</p>
            <p>Amount: {ethers.utils.formatEther(loan.loanAmount)} ETH</p>
            <p>Interest Rate: {loan.interestRate.toString()}%</p>
            <p>Borrower: {loan.borrower}</p>
            <div>
              <button onClick={() => handleFundLoan(loan.id, ethers.utils.formatEther(loan.loanAmount))}>
                Fund Loan
              </button>
              <button onClick={() => handleRepayLoan(loan.id, ethers.utils.formatEther(loan.loanAmount))}>
                Repay Loan
              </button>
              <button onClick={() => handleLiquidateLoan(loan.id)}>
                Liquidate
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Admin Controls</h2>
        <form onSubmit={handleSetPlatformFee}>
          <input
            type="number"
            placeholder="New Platform Fee (%)"
            value={platformFee}
            onChange={(e) => setPlatformFee(e.target.value)}
          />
          <button type="submit">Set Platform Fee</button>
        </form>
        <button onClick={handleWithdrawFees}>Withdraw Fees</button>
      </div>
    </div>
  );
}

export default MicroLoanPlatform;
