import { motion } from 'framer-motion'
import { CreditCard, Calendar, DollarSign, TrendingUp } from 'lucide-react'
import { fadeIn } from '../utils/motion'

const LoanCard = ({ loan, isSelected, onSelect }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'badge-success'
      case 'Overdue':
        return 'badge-error'
      case 'Closed':
        return 'badge-warning'
      default:
        return 'badge-primary'
    }
  }

  return (
    <motion.div
      variants={fadeIn}
      onClick={onSelect}
      className={`card-hover cursor-pointer transition-all ${
        isSelected
          ? 'ring-2 ring-primary border-primary bg-blue-50'
          : 'hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            isSelected ? 'bg-primary' : 'bg-gray-100'
          }`}>
            <CreditCard className={`h-6 w-6 ${
              isSelected ? 'text-white' : 'text-gray-600'
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{loan.type}</h3>
            <p className="text-sm text-gray-500">{loan.accountNumber}</p>
          </div>
        </div>
        <span className={`badge ${getStatusColor(loan.status)}`}>
          {loan.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Principal</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(loan.principalAmount)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Outstanding</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(loan.outstandingBalance)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">EMI: {formatCurrency(loan.emiAmount)}</span>
        </div>
        <span className="text-sm text-gray-600">{loan.tenure} months</span>
      </div>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 pt-4 border-t border-primary/20"
        >
          <div className="flex items-center justify-center space-x-2 text-primary">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Selected</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default LoanCard
