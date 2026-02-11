import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Phone, Calendar, ArrowRight } from 'lucide-react'
import Button from './Button'
import Input from './Input'
import ProgressIndicator from './ProgressIndicator'
import { validatePhone, validateDOB } from '../utils/validation'
import { fadeIn } from '../utils/motion'

const AuthenticationFlow = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      sessionStorage.setItem('customerPhone', data.phone)
      sessionStorage.setItem('customerDOB', data.dob)
      
      toast.success('Information verified. Please enter OTP.')
      navigate('/verify-otp')
    } catch (error) {
      toast.error('Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressIndicator currentStep={1} totalSteps={4} />
      
      <motion.div
        {...fadeIn}
        className="card mt-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Customer Authentication
          </h2>
          <p className="text-gray-600">
            Please enter customer details to begin verification
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit phone number"
                className="pl-12"
                error={errors.phone?.message}
                {...register('phone', {
                  required: 'Phone number is required',
                  validate: (value) => validatePhone(value) || 'Please enter a valid 10-digit phone number',
                })}
              />
            </div>
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="dob"
                type="date"
                className="pl-12"
                error={errors.dob?.message}
                {...register('dob', {
                  required: 'Date of birth is required',
                  validate: (value) => validateDOB(value) || 'Please enter a valid date of birth',
                })}
              />
            </div>
            {errors.dob && (
              <p className="mt-2 text-sm text-red-600">{errors.dob.message}</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Security Notice</h3>
                <p className="mt-1 text-sm text-blue-700">
                  All information is encrypted and handled securely. An OTP will be sent to the registered mobile number for verification.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
            icon={<ArrowRight className="h-5 w-5" />}
            iconPosition="right"
          >
            {isLoading ? 'Verifying...' : 'Continue to OTP Verification'}
          </Button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-gray-500">
          Having trouble? Contact support at{' '}
          <a href="tel:1800-123-4567" className="text-primary hover:underline font-medium">
            1800-123-4567
          </a>
        </p>
      </motion.div>
    </div>
  )
}

export default AuthenticationFlow
