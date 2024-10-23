// import LandingPage from './pages/LandingPage'
// import ActiveLoans from './components/ActiveLoans'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lending from './pages/Lending';
import Borrowing from './pages/Borrowing';
import LandingPage from "./pages/LandingPage";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Add a default route for the root */}
        <Route path="/" element={<LandingPage/>} />
        <Route path="*" element={<div>Page Not Found</div>} />
        <Route path="/Lending" element={<Lending />} />
        <Route path="/Borrowing" element={<Borrowing />} />
      </Routes>
    </BrowserRouter>
  
  )
}
export default App