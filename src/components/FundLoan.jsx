import  { useState } from 'react';
import { ethers } from 'ethers';
import MICROLOAN_ABI from './abi.json';
import { MICROLOAN_ADDRESS } from './contractAddress';
import { Typography, Form,Input,Button } from 'antd';

const {Paragraph,Title} = Typography

const FundLoan = () => {
  // const [loanId, setLoanId] = useState('');
  // const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFundLoan = async (values) => {
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
      // const parsedLoanId = loanId; // Parse the loan ID
      const parsedLoanId = values.loanid; // Parse the loan ID
      const parsedAmount = ethers.parseUnits(values.amount, 18); // Convert ETH to Wei

      const tx = await contract.fundLoan(parsedLoanId, {
        value: parsedAmount,
      });

      const receipt = await tx.wait();
      setSuccess(`Loan funded successfully! Transaction Hash: ${receipt.transactionHash}`);
    } catch (error) {
      console.error('Error funding loan:', error);
      setError(error.message || 'Failed to fund loan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Title level={3}>Fund Loan</Title>
      {error && <Paragraph>{error}</Paragraph>}
      {success && <Paragraph >{success}</Paragraph>}
      
      <Form
        layout="vertical"
        style={{
          maxWidth: 300,
        }}
        onFinish={handleFundLoan}
      >
        <Form.Item label="Loan Id" name="loanid" rules={[{ required: true, message: 'Please input Load ID' }]}>
          <Input placeholder='Enter Loan ID' />
        </Form.Item>

        <Form.Item label="Amount (ETH)" name="amount" rules={[{ required: true, message: 'Please input Amount' }]}>
          <Input placeholder='Enter Amount in ETH' />
        </Form.Item>
    
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Funding...' : 'Fund Loan'}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default FundLoan;
