import React from 'react';
import { useNavigate } from "react-router-dom";
// import Lending from './Lending.jsx';
// import Borrowing from './Borrowing.jsx';
import borrow from "../../public/Lending.png";
import lending from "../../public/Lending2.webp"

const LandingPage = () => {
  // Move useNavigate inside the component
  const navigate = useNavigate();

  // Handle click event
  const handleLendingClick = () => {
    navigate('/Lending'); // Navigate to the Lending page
  };
  const handleBorrowingClick = ()=>{
    navigate("/Borrowing")
  }

  return (
    <>
      <button onClick={handleLendingClick}>
        <img src={borrow} alt="tushar" />
        Lending
      </button>
      <button onClick={handleBorrowingClick}>
        <img src={lending} alt="tushar" />
        Borrow
      </button>
    </>
  );
};

export default LandingPage;
