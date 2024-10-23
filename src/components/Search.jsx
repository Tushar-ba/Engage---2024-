import  { useState } from 'react';
import axios from 'axios';
import { Input, Card,Typography,Button,Space ,List} from 'antd';

const {Title, Paragraph} = Typography

const Search = () => {
  const [address, setAddress] = useState("");
  const [nftData, setNftData] = useState(null); // State to store fetched NFT data
  const [error, setError] = useState(null); // State to handle errors
  const [tokenId, setTokenId] = useState("")

  const fetchNFTData = async () => {
    try {
      // Make sure to replace ':address' with the actual address
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://deep-index.moralis.io/api/v2.2/nft/${address}/${tokenId}`,
        headers: {
          'Content-Type': 'application/json',
          // You need to add your Moralis API key here
          'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImRjZTJiNDRhLWEwNjItNDM1Yi04OGRkLWQ4MWRjNjQ3YTdjZiIsIm9yZ0lkIjoiNDA1MzEwIiwidXNlcklkIjoiNDE2NDgwIiwidHlwZUlkIjoiNTFlYmNhMTYtNmYwYi00NjVhLWEzZTAtNmNlMTI2MDkzM2E0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MjQxNDUzMzEsImV4cCI6NDg3OTkwNTMzMX0.y9qAa0sUjDJC0nOL6ZvU-ePnvTaOkTr_Xo8gOEJlbWI', // Replace with your actual API key
        },
      };
      const response = await axios.request(config);
      setNftData(response.data); // Set the fetched data to state
      setError(null); // Reset error state if the request is successful
    } catch (error) {
      setError(error.message); // Handle errors
      setNftData(null); // Reset nftData on error
    }
  };

  return (
    <>
    <Space
      direction="vertical"
    >
      <Input
        placeholder="Enter NFT Address"
        required
        onChange={(e) => { setAddress(e.target.value); }}
      />
      <Input
        placeholder="Enter ID"
        onChange={(e) => { setTokenId(e.target.value); }}
      />
      <Button onClick={fetchNFTData}>Fetch NFT Data</Button>
    </Space>

      {error && <Paragraph style={{ color: 'red' }}>Error: {error}</Paragraph>}
      {nftData && 
          <List
            dataSource={nftData}
            renderItem={(loan) => 
            <List.Item>
              <Card
                hoverable
                style={{ width: 300 }}
                cover={<img alt="example" src={response?.image}/>}
              >
                <>
                  <Space align="center">
                    <Paragraph strong>Token Address:</Paragraph>
                    <Paragraph>{loan?.token_address}</Paragraph>
                  </Space>
                  <Space align='center'>
                    <Paragraph strong>Token Id</Paragraph>
                    <Paragraph>{loan?.token_id}</Paragraph>
                  </Space>
                  <Space align='center'>
                    <Paragraph strong>Owner:</Paragraph>
                    <Paragraph>{loan?.owner_of}</Paragraph>
                  </Space>
                  <Space align='center'>
                    <Paragraph strong>Floor Price:</Paragraph>
                    <Paragraph>{loan?.floor_price}</Paragraph>
                  </Space>
                  <Space align='center'>
                    <Paragraph strong>Floor Price(USD):</Paragraph>
                    <Paragraph>{loan?.floor_price_usd} ETH</Paragraph>
                  </Space>
                </>
              </Card>
            </List.Item>}
          />
      } 
    </>
  );
};

export default Search;