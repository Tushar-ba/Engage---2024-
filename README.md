NFTLend
Deployed Link- https://engage-2024.vercel.app/

Make sure your NFT has the permission setApprovalforAll in the NFT contract which is minted in https://testnets.opensea.io/

NFTLend Dapp contract addrerss- 0xF04d5657A9C84406B989473Bb3E4A8B6990D3f4D

Above is the NFTLend Dapp contract address. Make sure you have the approvals ready from Polygon Amoy in NFT contract address.

Introduction
The NFTLend is a decentralized application (dApp) designed to facilitate peer-to-peer lending using NFTs (ERC721 tokens) as collateral. Borrowers can stake their NFTs to request loans, while lenders can fund these loan requests, earning interest over time. The platform ensures secure transactions by locking the NFTs as collateral until the loan is repaid or defaulted, at which point the lender can claim the NFT. Built on Polygon, it leverages smart contracts for managing collateral, loan funding, repayment, and liquidation, providing transparency and automation in decentralized finance (DeFi).

Problem It Solves
Problem 1- NFT Liquidity Issues and Idle Capital Traditionally, NFT holders face liquidity issues with their assets, while individuals with idle capital lack opportunities for substantial returns.

Solution- We introduce NFTLend, a transparent, secure, and user-friendly ecosystem that facilitates instant NFT-backed loans, effectively solving the challenge.

Problem 2- Trust Issues and Security Concerns Participants in the NFT market often grapple with trust issues. Additionally, concerns about theft or loss from server shutdowns or project discontinuations persist.

Solution- We utilize the Polygon blockchain and smart contracts, ensuring a secure lending process while eliminating the risk of theft or loss, as NFTs are securely held in the blockchain.

Functions
NFTLend offers key functionalities for decentralized lending:

NFT-backed Loans: Borrowers can secure loans by staking their NFTs as collateral, accessing liquidity without selling their digital assets.
P2P Lending with Interest: Lenders can fund loans, earning interest over time, while benefiting from the security of NFT collateral.
Collateral Liquidation: In case of default, lenders can claim the staked NFT, ensuring reduced risk in peer-to-peer lending.
How It Works
Requesting and Funding a Loan
Create Loan Request: Borrowers stake their ERC721 NFT as collateral and specify loan details such as the amount, interest rate, and repayment duration.
NFT Collateral Locking: The NFT is securely transferred to the smart contract, ensuring it cannot be withdrawn or sold by the borrower during the loan period.
Loan Funding by Lender: Lenders review loan requests and can fund the loan by transferring the specified amount to the borrower. The NFT remains locked as collateral.
Repayment with Interest: Borrowers repay the loan, including the agreed interest, within the specified timeframe to reclaim their NFT.
Collateral Liquidation: If the borrower fails to repay within the loan duration, the lender can claim the NFT as collateral, reducing the risk of lending.
Solvers
The NFTLend Platform relies on a network of Lenders who provide the funds for borrowers. Lenders are incentivized by earning interest on the loan amount. In case of default, they can claim the NFT collateral as compensation, ensuring their investments are protected while offering borrowers access to quick liquidity.

Screenshots
NFTLend Interface
NFTLend Interface

Requesting a Loan
NFTLend Interface

Liquidate Loan
NFTLend Interface

Fetching NFT
NFTLend Interface

Roadmap
Automatic Liquidation: If NFT prices fall dramatically, users have an option to automatically liquidate their assets.

Peer-to-pool Function: Allows multiple lenders to contribute to a single loan and vice versa.

Deployments
Polygon Amoy contract address
0xF04d5657A9C84406B989473Bb3E4A8B6990D3f4D

Ethereum Sepolia contract address
0x9A76a62E9A6436D502922A1d9ce697619493DAee

License
MIT

Acknowledgements
Thank you for your interest in NFTLend! We hope our project inspires more privacy-preserving applications on the Polygon blockchain.
