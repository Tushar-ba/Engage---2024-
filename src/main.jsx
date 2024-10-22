import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ActiveLoans from './components/ActiveLoans.jsx'
import './index.css'
import CreateLoanRequest from './components/CreateLoanRequest.jsx'
import FundLoan from './components/FundLoan.jsx'
import RepayLoan from './components/RepayLoan.jsx'
import LiquidateLoan from './components/LiquidateLoan.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ActiveLoans/>
    <CreateLoanRequest/>
    <FundLoan/>
    <RepayLoan/>
    <LiquidateLoan/>
  </StrictMode>,
)
