import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import MICROLOAN_ABI from './abi.json';
import { MICROLOAN_ADDRESS } from './contractAddress';
import { Typography, Card, Space, List } from "antd";
import axios from 'axios';

const { Paragraph, Title } = Typography;

const ActiveLoans = () => {
  const [activeLoans, setActiveLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');


  const fetchNFTData = async (address, identifier) => {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://testnets-api.opensea.io/api/v2/chain/amoy/contract/${address}/nfts/${identifier}`,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error('Error fetching NFT data:', error);
      return null;
    }
  };

  const fetchActiveLoans = async () => {
    try {
      setError('');
      setIsLoading(true);

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
      
      const loanIds = await contract.getActiveLoanRequests();
      
      const loans = await Promise.all(
        loanIds.map(async (loanId) => {
          const loan = await contract.loanRequests(loanId);
          const nftData = await fetchNFTData(loan.collateralToken, loan.collateralId.toString());
          
          return {
            id: loanId.toString(),
            borrower: loan.borrower,
            collateralToken: loan.collateralToken,
            collateralId: loan.collateralId.toString(),
            loanAmount: ethers.formatUnits(loan.loanAmount, 18),
            interestRate: loan.interestRate.toString(),
            duration: loan.duration.toString(),
            startTime: new Date(Number(loan.startTime) * 1000).toLocaleString(),
            lender: loan.lender === ethers.ZeroAddress ? 'None' : loan.lender,
            isActive: loan.isActive,
            isFunded: loan.isFunded,
            isRepaid: loan.isRepaid,
            isLiquidated: loan.isLiquidated,
            nftData: nftData
          };
        })
      );

      setActiveLoans(loans);
    } catch (error) {
      console.error('Error fetching active loans:', error);
      setError(error.message || 'Failed to fetch active loans');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveLoans();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', fetchActiveLoans);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

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
        <List
          dataSource={activeLoans}
          renderItem={(loan) => (
            <List.Item>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={
                  <img 
                    alt={loan.nftData?.nft?.name || "NFT"} 
                    src={loan.nftData?.nft?.display_image_url} 
                    style={{ height: 240, objectFit: 'cover' }}
                  />
                }
              >
                <>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Space align="center">
                      <Paragraph strong>Loan ID:</Paragraph>
                      <Paragraph>{loan.id}</Paragraph>
                    </Space>
                    <Space align='center'>
                      <Paragraph strong>Borrower:</Paragraph>
                      <Paragraph>{`${loan.borrower.slice(0, 6)}...${loan.borrower.slice(-4)}`}</Paragraph>
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
                      <Paragraph strong>Status:</Paragraph>
                      <Paragraph>{loan.isRepaid ? 'Repaid' : loan.isLiquidated ? 'Liquidated' : 'Active'}</Paragraph>
                    </Space>
                  </Space>
                </>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Paragraph>No active loans available.</Paragraph>
      )}
    </>
  );
};

export default ActiveLoans;