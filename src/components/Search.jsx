import { useState } from 'react';
import axios from 'axios';
import { Input, Card, Typography, Button, Space } from 'antd';

const { Title, Paragraph } = Typography;

const Search = () => {
  const [address, setAddress] = useState("");
  const [nftData, setNftData] = useState(null);
  const [error, setError] = useState(null);
  const [tokenId, setTokenId] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchNFTData = async () => {
    if (!address || !tokenId) {
      setError("Please enter both NFT address and token ID");
      return;
    }
    setLoading(true);
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://deep-index.moralis.io/api/v2.2/nft/${address}/${tokenId}`,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImRjZTJiNDRhLWEwNjItNDM1Yi04OGRkLWQ4MWRjNjQ3YTdjZiIsIm9yZ0lkIjoiNDA1MzEwIiwidXNlcklkIjoiNDE2NDgwIiwidHlwZUlkIjoiNTFlYmNhMTYtNmYwYi00NjVhLWEzZTAtNmNlMTI2MDkzM2E0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MjQxNDUzMzEsImV4cCI6NDg3OTkwNTMzMX0.y9qAa0sUjDJC0nOL6ZvU-ePnvTaOkTr_Xo8gOEJlbWI',
        },
      };

      const response = await axios.request(config);
      const metadata = response.data.metadata ? 
        (typeof response.data.metadata === 'string' ? 
          JSON.parse(response.data.metadata) : 
          response.data.metadata) : 
        null;
      
      setNftData({ ...response.data, metadata });
      setError(null);
    } catch (error) {
      setError(error.message);
      setNftData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%', padding: '20px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          placeholder="Enter NFT Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Input
          placeholder="Enter Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <Button 
          type="primary" 
          onClick={fetchNFTData} 
          loading={loading}
          style={{ width: '100%' }}
        >
          Fetch NFT Data
        </Button>
      </Space>

      {error && (
        <Paragraph style={{ color: 'red' }}>
          Error: {error}
        </Paragraph>
      )}

      {nftData && (
        <Card
          hoverable
          style={{ width: '100%', maxWidth: 500, margin: '0 auto' }}
          cover={nftData.metadata?.image_url && (
            <img 
              alt="NFT" 
              src={nftData.metadata.image_url}
              style={{ maxHeight: 300, objectFit: 'contain' }}
            />
          )}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Paragraph strong>Token Address:</Paragraph>
              <Paragraph>{nftData.token_address}</Paragraph>
            </Space>
            
            <Space>
              <Paragraph strong>Token ID:</Paragraph>
              <Paragraph>{nftData.token_id}</Paragraph>
            </Space>
            
            <Space>
              <Paragraph strong>Owner:</Paragraph>
              <Paragraph>{nftData.owner_of}</Paragraph>
            </Space>
            
            {nftData.floor_price && (
              <Space>
                <Paragraph strong>Floor Price:</Paragraph>
                <Paragraph>{nftData.floor_price} ETH</Paragraph>
              </Space>
            )}
            
            {nftData.floor_price_usd && (
              <Space>
                <Paragraph strong>Floor Price (USD):</Paragraph>
                <Paragraph>${nftData.floor_price_usd}</Paragraph>
              </Space>
            )}
          </Space>
        </Card>
      )}
    </Space>
  );
};

export default Search;