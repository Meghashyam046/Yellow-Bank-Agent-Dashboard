import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { CreditCard, ArrowRight, Search } from 'lucide-react'
import LoanCard from './LoanCard'
import Button from './Button'
import ProgressIndicator from './ProgressIndicator'
import ErrorHandler from './ErrorHandler'
import { loanAccounts } from '../data/mockData'
import { fadeIn, staggerContainer } from '../utils/motion'

const LoanAccountsList = () => {
  const navigate = useNavigate()
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState(null)
  const [filteredLoans, setFilteredLoans] = useState(loanAccounts)

  useEffect(() => {
    const otpVerified = sessionStorage.getItem('otpVerified')
    if (!otpVerified) {
      setError({
        type: 'unauthorized',
        message: 'Please complete OTP verification first.',
      })
    }
  }, [])

  useEffect(() => {
    const filtered = loanAccounts.filter(loan =>
      loan.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredLoans(filtered)
  }, [searchTerm])

  const handleLoanSelect = (loanId) => {
    setSelectedLoan(loanId)
  }

  const handleContinue = () => {
    if (!selectedLoan) {
      toast.error('Please select a loan account to continue')
      return
    }

    sessionStorage.setItem('selectedLoanId', selectedLoan)
    toast.success('Loan account selected')
    navigate(`/loan-details/${selectedLoan}`)
  }

  if (error) {
    return <ErrorHandler error={error} onRetry={() => navigate('/verify-otp')} />
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ProgressIndicator currentStep={3} totalSteps={4} />
      
      <motion.div
        {...fadeIn}
        className="mt-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Select Loan Account
          </h2>
          <p className="text-gray-600">
            Choose the loan account you want to view details for
          </p>
        </div>

        <div className="card mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by account number, type, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12"
            />
          </div>
        </div>

        {filteredLoans.length === 0 ? (
          <motion.div
            {...fadeIn}
            className="card text-center py-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No loan accounts found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            {filteredLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                isSelected={selectedLoan === loan.id}
                onSelect={() => handleLoanSelect(loan.id)}
              />
            ))}
          </motion.div>
        )}

        {filteredLoans.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-between items-center"
          >
            <button
              onClick={() => navigate('/verify-otp')}
              className="text-sm text-gray-500 hover:text-primary transition-colors"
            >
              ← Back to verification
            </button>
            
            <Button
              variant="primary"
              onClick={handleContinue}
              disabled={!selectedLoan}
              icon={<ArrowRight className="h-5 w-5" />}
              iconPosition="right"
            >
              View Loan Details
            </Button>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 card bg-blue-50 border-blue-200"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Account Information</h3>
            <p className="mt-1 text-sm text-blue-700">
              Showing {filteredLoans.length} of {loanAccounts.length} loan accounts. Select an account to view detailed information including payment history, outstanding balance, and more.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoanAccountsList
