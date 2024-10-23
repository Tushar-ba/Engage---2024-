import React from 'react'
import CreateLoanRequest from "../components/CreateLoanRequest"
import RepayLoan from "../components/RepayLoan"

const Borrowing = () => {
  return (
    <>
    <div className='bg-gradient-to-r from-violet-500 to-fuchsia-500 h-[100vh]'> 
    <CreateLoanRequest/>
    <RepayLoan/>
    </div>
    </>
  )
}

export default Borrowing