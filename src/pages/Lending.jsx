import React from 'react'
import FundLoan from "../components/FundLoan.jsx"
import LiquidateLoan from "../components/LiquidateLoan.jsx"
import ActiveLoans from "../components/ActiveLoans.jsx"
import Search from '../components/Search.jsx'

const Lending = () => {
  return (
    <>
    <LiquidateLoan/>
    <ActiveLoans/>
    <FundLoan/>
    <Search/>
    </>
  )
}

export default Lending