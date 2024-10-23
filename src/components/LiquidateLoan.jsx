import React, { useState } from 'react';
import { ethers } from 'ethers';
import MICROLOAN_ABI from './abi.json';
import { MICROLOAN_ADDRESS } from './contractAddress';
import { Typography,Form,Input,Button } from "antd";

const { Paragraph,Title } = Typography;

const LiquidateLoan = () => {
  // const [loanId, setLoanId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLiquidateLoan = async (values) => {
   
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
      console.log(signer)

      const contract = new ethers.Contract(MICROLOAN_ADDRESS, MICROLOAN_ABI, signer);
      // const parsedLoanId = loanId; // Parse the loan ID
      const parsedLoanId = values.loanid;
      console.log(parsedLoanId)

      const tx = await contract.liquidateLoan(parsedLoanId);

      const receipt = await tx.wait();
      setSuccess(`Loan liquidated successfully! Transaction Hash: ${receipt.transactionHash}`);
    } catch (error) {
      console.error('Error liquidating loan:', error);
      setError(error.message || 'Failed to liquidate loan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <Title level={3}>Liquidate Loan</Title>
      {error && <Paragraph>{error}</Paragraph>}
      {success && <Paragraph>{success}</Paragraph>}
      <Form
        layout="vertical"
        style={{
          maxWidth: 300,
        }}
        onFinish={handleLiquidateLoan}
      >
        <Form.Item label="Loan Id" name="loanid">
          <Input />
        </Form.Item>
    
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Liquidating...' : 'Liquidate Loan'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LiquidateLoan;
