import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Star, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react'
import Button from './Button'
import { fadeIn } from '../utils/motion'

const CSATSurvey = () => {
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleRatingClick = (value) => {
    setRating(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Please provide a rating')
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      sessionStorage.setItem('csatRating', rating.toString())
      sessionStorage.setItem('csatFeedback', feedback)
      
      setIsSubmitted(true)
      toast.success('Thank you for your feedback!')
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStartNew = () => {
    sessionStorage.clear()
    navigate('/auth')
    toast.success('Ready for new customer')
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          {...fadeIn}
          className="card text-center py-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Feedback Submitted Successfully!
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Thank you for taking the time to provide feedback. Your input helps us improve our services.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="text-2xl font-bold text-gray-900">{rating}/5</span>
            </div>
            <p className="text-sm text-gray-600">Customer Satisfaction Rating</p>
            {feedback && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm text-gray-700 italic">"{feedback}"</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              onClick={handleStartNew}
              icon={<ArrowRight className="h-5 w-5" />}
              iconPosition="right"
            >
              Start New Session
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/loan-accounts')}
            >
              Back to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        {...fadeIn}
        className="card"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Customer Satisfaction Survey
          </h2>
          <p className="text-gray-600">
            How would you rate your experience today?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-center text-sm font-medium text-gray-700 mb-4">
              Please rate your satisfaction
            </label>
            <div className="flex justify-center space-x-3">
              {[1, 2, 3, 4, 5].map((value) => (
                <motion.button
                  key={value}
                  type="button"
                  onClick={() => handleRatingClick(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="focus:outline-none transition-transform"
                >
                  <Star
                    className={`h-12 w-12 transition-colors ${
                      value <= (hoveredRating || rating)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            <div className="flex justify-between mt-2 px-2">
              <span className="text-xs text-gray-500">Very Dissatisfied</span>
              <span className="text-xs text-gray-500">Very Satisfied</span>
            </div>
          </div>

          {rating > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Feedback (Optional)
              </label>
              <textarea
                id="feedback"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Please share any additional comments or suggestions..."
                className="input-field resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {feedback.length}/500 characters
              </p>
            </motion.div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Privacy Notice</h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Your feedback is anonymous and will be used solely to improve our services. Thank you for helping us serve you better.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/loan-accounts')}
              className="flex-1"
            >
              Skip Survey
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || rating === 0}
              className="flex-1"
              icon={<CheckCircle className="h-5 w-5" />}
              iconPosition="right"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-center"
      >
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-primary transition-colors"
        >
          ← Back to loan details
        </button>
      </motion.div>
    </div>
  )
}

export default CSATSurvey
