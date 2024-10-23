import React from 'react'
import FundLoan from "../components/FundLoan.jsx"
import LiquidateLoan from "../components/LiquidateLoan.jsx"
import ActiveLoans from "../components/ActiveLoans.jsx"
import Search from '../components/Search.jsx'

const Lending = () => {
  return (
    <>
    <div className='bg-gradient-to-r from-violet-500 to-fuchsia-500 h-[100vh]'>
    <LiquidateLoan/>
    <ActiveLoans/>
    <FundLoan/>
    <Search/>
    </div>
    </>
  )
}

export default Lending