import React from 'react'
import CreateLoanRequest from "../components/CreateLoanRequest"
import RepayLoan from "../components/RepayLoan"

const Borrowing = () => {
  return (
    <>
    <div>
    <CreateLoanRequest/>
    <RepayLoan/>
    </div>
    </>
  )
}

export default Borrowing