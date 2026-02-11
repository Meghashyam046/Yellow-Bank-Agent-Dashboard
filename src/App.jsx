import { Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AuthenticationFlow from './components/AuthenticationFlow'
import OTPVerification from './components/OTPVerification'
import LoanAccountsList from './components/LoanAccountsList'
import LoanDetails from './components/LoanDetails'
import CSATSurvey from './components/CSATSurvey'
import { pageTransition } from './utils/motion'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">YB</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Yellow Bank</h1>
                <p className="text-xs text-gray-500">Agent Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">Agent Portal</p>
                <p className="text-xs text-gray-500">Secure Access</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route
            path="/auth"
            element={
              <motion.div {...pageTransition}>
                <AuthenticationFlow />
              </motion.div>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <motion.div {...pageTransition}>
                <OTPVerification />
              </motion.div>
            }
          />
          <Route
            path="/loan-accounts"
            element={
              <motion.div {...pageTransition}>
                <LoanAccountsList />
              </motion.div>
            }
          />
          <Route
            path="/loan-details/:loanId"
            element={
              <motion.div {...pageTransition}>
                <LoanDetails />
              </motion.div>
            }
          />
          <Route
            path="/csat-survey"
            element={
              <motion.div {...pageTransition}>
                <CSATSurvey />
              </motion.div>
            }
          />
        </Routes>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-500">
              © 2024 Yellow Bank. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
