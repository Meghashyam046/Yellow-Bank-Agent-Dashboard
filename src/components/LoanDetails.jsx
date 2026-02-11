import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  ArrowRight,
} from 'lucide-react'
import Button from './Button'
import ProgressIndicator from './ProgressIndicator'
import ErrorHandler from './ErrorHandler'
import { loanAccounts, loanDetails } from '../data/mockData'
import { fadeIn, staggerContainer } from '../utils/motion'

const LoanDetails = () => {
  const { loanId } = useParams()
  const navigate = useNavigate()
  const [loan, setLoan] = useState(null)
  const [details, setDetails] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const selectedLoanId = sessionStorage.getItem('selectedLoanId')
    if (!selectedLoanId || selectedLoanId !== loanId) {
      setError({
        type: 'invalid_loan',
        message: 'Invalid loan account. Please select a loan account first.',
      })
      return
    }

    const loanAccount = loanAccounts.find(l => l.id === loanId)
    const loanDetail = loanDetails.find(l => l.loanId === loanId)

    if (!loanAccount || !loanDetail) {
      setError({
        type: 'not_found',
        message: 'Loan details not found.',
      })
      return
    }

    setLoan(loanAccount)
    setDetails(loanDetail)
  }, [loanId])

  const handleDownloadStatement = () => {
    toast.success('Statement download started')
  }

  const handleProceedToCSAT = () => {
    navigate('/csat-survey')
  }

  if (error) {
    return <ErrorHandler error={error} onRetry={() => navigate('/loan-accounts')} />
  }

  if (!loan || !details) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ProgressIndicator currentStep={4} totalSteps={4} />
      
      <motion.div
        {...fadeIn}
        className="mt-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Loan Account Details
            </h2>
            <p className="text-gray-600">
              Account Number: {loan.accountNumber}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleDownloadStatement}
            icon={<Download className="h-5 w-5" />}
          >
            Download Statement
          </Button>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div
            variants={fadeIn}
            className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <span className="badge badge-primary">Principal</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(loan.principalAmount)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Loan Amount</p>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <span className="badge badge-success">Balance</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(loan.outstandingBalance)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Outstanding</p>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
          >
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-8 w-8 text-purple-600" />
              <span className="badge bg-purple-100 text-purple-800">EMI</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(loan.emiAmount)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Monthly Payment</p>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <span className="badge bg-orange-100 text-orange-800">Tenure</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {loan.tenure} months
            </p>
            <p className="text-sm text-gray-600 mt-1">Remaining</p>
          </motion.div>
        </motion.div>

        <div className="card mb-8">
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('payment-history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'payment-history'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Payment History
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'documents'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Documents
              </button>
            </nav>
          </div>

          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              {...fadeIn}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loan Type:</span>
                      <span className="font-medium text-gray-900">{loan.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Rate:</span>
                      <span className="font-medium text-gray-900">{details.interestRate}% p.a.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Disbursement Date:</span>
                      <span className="font-medium text-gray-900">{formatDate(details.disbursementDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Maturity Date:</span>
                      <span className="font-medium text-gray-900">{formatDate(details.maturityDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`badge ${
                        loan.status === 'Active' ? 'badge-success' :
                        loan.status === 'Overdue' ? 'badge-error' :
                        'badge-warning'
                      }`}>
                        {loan.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next EMI Date:</span>
                      <span className="font-medium text-gray-900">{formatDate(details.nextEmiDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Payment:</span>
                      <span className="font-medium text-gray-900">{formatDate(details.lastPaymentDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Paid:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(details.totalPaid)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prepayment Charges:</span>
                      <span className="font-medium text-gray-900">{details.prepaymentCharges}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Important Note</h3>
                    <p className="mt-1 text-sm text-blue-700">
                      {details.importantNotes}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'payment-history' && (
            <motion.div
              key="payment-history"
              {...fadeIn}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>
              <div className="space-y-4">
                {details.paymentHistory.map((payment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        payment.status === 'Paid' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {payment.status === 'Paid' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(payment.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`badge ${
                        payment.status === 'Paid' ? 'badge-success' : 'badge-error'
                      }`}>
                        {payment.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {payment.method}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              {...fadeIn}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-all cursor-pointer"
                    onClick={() => toast.success(`Opening ${doc.name}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.size} • {doc.date}</p>
                      </div>
                    </div>
                    <Download className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between items-center"
        >
          <button
            onClick={() => navigate('/loan-accounts')}
            className="text-sm text-gray-500 hover:text-primary transition-colors"
          >
            ← Back to loan accounts
          </button>
          
          <Button
            variant="primary"
            onClick={handleProceedToCSAT}
            icon={<ArrowRight className="h-5 w-5" />}
            iconPosition="right"
          >
            Complete Survey
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoanDetails
