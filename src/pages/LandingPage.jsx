
import { useNavigate } from "react-router-dom";
// import Lending from './Lending.jsx';
// import Borrowing from './Borrowing.jsx';
import borrow from "../../public/Lending.png";
import lending from "../../public/Lending2.webp"
import logo from "../../public/logo.jpg"


import { Button, Flex, Tooltip } from 'antd';

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
  <div className="p-10 bg-gradient-to-r from-violet-500 to-fuchsia-500">
    <img src={logo} alt="" className="w-20" />
    <div className=" w-[100vw] h-[100vh]">
      <h1 className="text-5xl m-[90px] text-center hover:"  >Use your NFTs to get a loan</h1>
      <div className="flex justify-center items-center  gap-8 mt-[100px]">
     <div className="flex justify-itmes-center flex-col">
      <div>
      <img src={borrow} alt="tushar" className="w-[500px] cursor-pointer rounded-md"  onClick={handleBorrowingClick}/>
      </div>
        <div> <h1 className="text-3xl text-center">Borrow Loan</h1></div>
      </div>
      <div>
        <img src={lending} alt="tushar"onClick={handleLendingClick} className="w-[450px] flex justify-itmes-center flex-col cursor-pointer rounded-md"/>
        <h1 className="text-3xl text-center ">Lend Loan</h1>
        </div>
        </div>
        <h1 className="text-5xl m-[90px] text-center"> Use your NFT as collateral to borrow crypto from lenders. Repay your loan, and you get your NFT back.</h1>
        </div>
        </div>
    </>
  );
};

export default LandingPage;
