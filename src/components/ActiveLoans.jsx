import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import MICROLOAN_ABI from './abi.json';
import { MICROLOAN_ADDRESS } from './contractAddress';
import { Typography,Card, Space ,List} from "antd";
import axios from 'axios'; // Make sure to import axios


const { Paragraph,Title } = Typography;

const ActiveLoans = () => {
  const [activeLoans, setActiveLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageUrl,setImageUrl] = useState('');
  const [id,setId] = useState("");
  const [address, setAddress]= ("")
  

  
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

       
      const loanIds = await contract.getActiveLoanRequests();

       
      const loans = await Promise.all(
        loanIds.map(async (loanId) => {
          const loan = await contract.loanRequests(loanId);
          const imageUrl = await fetchNFTData(loan.collateralToken, loan.collateralId.toString());
          setImageUrl(imageUrl)
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

  const fetchNFTData = async (address,identifier) => {
    try {
      // Make sure to replace ':address' with the actual address
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://testnets-api.opensea.io/api/v2/chain/amoy/contract/0x68f4d8e650c5b89983f531f9451717002e35c030/nfts/`, // Fixed URL
        headers: {
          'Content-Type': 'application/json',
          // You need to add your Moralis API key here
        },
      };
      const response = await axios.request(config);
      setImageUrl(response.data); // Set the fetched data to state
      
      setError(null); // Reset error state if the request is successful
    } catch (error) {
      setError(error.message); // Handle errors
      setImageUrl(null); // Reset nftData on error
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
    <>
      <Title level={3}>Active Loans</Title>
      {isLoading ? (
        <Paragraph>Loading...</Paragraph>
      ) : activeLoans.length > 0 ? (
        <>
           <List
            dataSource={activeLoans}
            renderItem={(loan) => 
            <List.Item>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={<img alt="example" src={imageUrl?.nft?.image_url} />}
              >
                <>
                  <Space align="center">
                    <Paragraph strong>Loan ID:</Paragraph>
                    <Paragraph>{loan.id}</Paragraph>
                  </Space>
                  <Space align='center'>
                    <Paragraph strong>Borrower:</Paragraph>
                    <Paragraph>{loan.borrower}</Paragraph>
                  </Space>
                  <Space align='center'>
                    <Paragraph strong>Collateral Token:</Paragraph>
                    <Paragraph>{loan.collateralToken}</Paragraph>
                  </Space>
                  <Space align='center'>
                    <Paragraph strong>Collateral ID:</Paragraph>
                    <Paragraph>{loan.collateralId}</Paragraph>
                  </Space>
                  <Space align='center'>
                    <Paragraph strong>Loan Amount:</Paragraph>
                    <Paragraph>{loan.loanAmount} ETH</Paragraph>
                  </Space>
                  <Space align='center'>
                    <Paragraph strong>Interest Rate:</Paragraph>
                    <Paragraph>{loan.interestRate}%</Paragraph>
                  </Space>
                  <Space align='center'>
                    <Paragraph strong>Duration:</Paragraph>
                    <Paragraph>{loan.duration} seconds</Paragraph>
                  </Space>
                  <Space align='center'>
                    <Paragraph strong>Start Time:</Paragraph>
                    <Paragraph>{loan.startTime}</Paragraph>
                  </Space>
                  <Space align='center'>
                    <Paragraph strong>Lender:</Paragraph>
                    <Paragraph>{loan.lender}</Paragraph>
                  </Space>
                  <Space align='center'>
                    <Paragraph strong>Status:</Paragraph>
                    <Paragraph>{loan.isRepaid ? 'Repaid' : loan.isLiquidated ? 'Liquidated' : 'Active'}</Paragraph>
                  </Space>
                </>
              </Card>
            </List.Item>}
          />
        </>
      ) : (
        <Paragraph>No active loans available.</Paragraph>
      )}
    </>
  );
};

export default ActiveLoans;
