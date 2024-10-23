import  { useState } from 'react';
import axios from 'axios'; // Make sure to import axios

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
        url: `https://deep-index.moralis.io/api/v2.2/nft/${address}/${tokenId}`, // Fixed URL
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
      <input
        type="text"
        placeholder="Enter NFT Address"
        onChange={(e) => { setAddress(e.target.value); }}
      />
      <input
        type="text"
        placeholder="Enter ID"
        onChange={(e) => { setTokenId(e.target.value); }}
      />
      <button onClick={fetchNFTData}>Fetch NFT Data</button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>} {/* Display error message */}
      {nftData && <pre>{JSON.stringify(nftData, null, 2)}</pre>} {/* Display fetched NFT data */}
    </>
  );
};

export default Search;