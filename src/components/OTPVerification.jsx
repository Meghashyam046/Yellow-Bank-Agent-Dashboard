import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Shield, ArrowRight, RefreshCw } from 'lucide-react'
import Button from './Button'
import ProgressIndicator from './ProgressIndicator'
import ErrorHandler from './ErrorHandler'
import { fadeIn } from '../utils/motion'

const OTPVerification = () => {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(120)
  const [canResend, setCanResend] = useState(false)
  const [error, setError] = useState(null)
  const inputRefs = useRef([])

  useEffect(() => {
    const customerPhone = sessionStorage.getItem('customerPhone')
    if (!customerPhone) {
      setError({
        type: 'missing_data',
        message: 'Customer information not found. Please start authentication again.',
      })
    }
  }, [])

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    if (!/^[0-9]*$/.test(value)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^[0-9]*$/.test(pastedData)) {
      return
    }

    const newOtp = [...otp]
    pastedData.split('').forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char
      }
    })
    setOtp(newOtp)

    const nextEmptyIndex = newOtp.findIndex((val) => !val)
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      inputRefs.current[5]?.focus()
    }
  }

  const handleResendOTP = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setTimer(120)
      setCanResend(false)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
      toast.success('New OTP sent successfully')
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const otpValue = otp.join('')
    if (otpValue.length !== 6) {
      toast.error('Please enter complete 6-digit OTP')
      return
    }

    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (otpValue === '123456') {
        sessionStorage.setItem('otpVerified', 'true')
        toast.success('OTP verified successfully')
        navigate('/loan-accounts')
      } else {
        toast.error('Invalid OTP. Please try again.')
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return <ErrorHandler error={error} onRetry={() => navigate('/auth')} />
  }

  const customerPhone = sessionStorage.getItem('customerPhone')
  const maskedPhone = customerPhone ? `******${customerPhone.slice(-4)}` : ''

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressIndicator currentStep={2} totalSteps={4} />
      
      <motion.div
        {...fadeIn}
        className="card mt-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            OTP Verification
          </h2>
          <p className="text-gray-600">
            Enter the 6-digit code sent to {maskedPhone}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              />
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-primary hover:underline font-medium inline-flex items-center space-x-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Resend OTP</span>
                </button>
              ) : (
                <span>
                  Resend OTP in <span className="font-semibold text-primary">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                </span>
              )}
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Demo Mode</h3>
                <p className="mt-1 text-sm text-yellow-700">
                  For testing purposes, use OTP: <span className="font-bold">123456</span>
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading || otp.some(d => !d)}
            icon={<ArrowRight className="h-5 w-5" />}
            iconPosition="right"
          >
            {isLoading ? 'Verifying...' : 'Verify & Continue'}
          </Button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-center"
      >
        <button
          onClick={() => navigate('/auth')}
          className="text-sm text-gray-500 hover:text-primary transition-colors"
        >
          ← Back to authentication
        </button>
      </motion.div>
    </div>
  )
}

export default OTPVerification
