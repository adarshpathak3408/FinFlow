import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ExpenseTracker from './pages/ExpenseTracker';
import { TransactionProvider } from './context/TransactionContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/app" 
            element={
              <TransactionProvider>
                <ExpenseTracker />
              </TransactionProvider>
            } 
          />
        </Routes>
      </Router>
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;