import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from './Button'
import { fadeIn } from '../utils/motion'

const ErrorHandler = ({ error, onRetry }) => {
  const navigate = useNavigate()

  const getErrorContent = () => {
    switch (error?.type) {
      case 'missing_data':
        return {
          title: 'Missing Information',
          message: error.message || 'Required customer information is missing.',
          icon: <AlertTriangle className="h-12 w-12 text-yellow-600" />,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
        }
      case 'unauthorized':
        return {
          title: 'Authentication Required',
          message: error.message || 'Please complete the authentication process.',
          icon: <AlertTriangle className="h-12 w-12 text-red-600" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        }
      case 'invalid_loan':
        return {
          title: 'Invalid Loan Selection',
          message: error.message || 'The selected loan account is invalid.',
          icon: <AlertTriangle className="h-12 w-12 text-orange-600" />,
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
        }
      case 'not_found':
        return {
          title: 'Not Found',
          message: error.message || 'The requested information could not be found.',
          icon: <AlertTriangle className="h-12 w-12 text-gray-600" />,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        }
      default:
        return {
          title: 'Something Went Wrong',
          message: error?.message || 'An unexpected error occurred. Please try again.',
          icon: <AlertTriangle className="h-12 w-12 text-red-600" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        }
    }
  }

  const errorContent = getErrorContent()

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        {...fadeIn}
        className={`card ${errorContent.bgColor} ${errorContent.borderColor} text-center py-12`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-lg"
        >
          {errorContent.icon}
        </motion.div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {errorContent.title}
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {errorContent.message}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onRetry && (
            <Button
              variant="primary"
              onClick={onRetry}
              icon={<RefreshCw className="h-5 w-5" />}
            >
              Try Again
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate('/auth')}
            icon={<Home className="h-5 w-5" />}
          >
            Start Over
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-gray-500">
          Need assistance? Contact support at{' '}
          <a href="tel:1800-123-4567" className="text-primary hover:underline font-medium">
            1800-123-4567
          </a>
        </p>
      </motion.div>
    </div>
  )
}

export default ErrorHandler
