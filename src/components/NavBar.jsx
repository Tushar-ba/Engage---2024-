import React from 'react'


const NavBar = async () => {
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
    const address = await signer.getAddress();
  }catch(err){
    console.log(error)
  }
  return (
   <h1 className='text-3xl'>{address}</h1>
  )
}

export default NavBar