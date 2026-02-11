import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, label: 'Authentication' },
    { number: 2, label: 'OTP Verification' },
    { number: 3, label: 'Select Account' },
    { number: 4, label: 'View Details' },
  ]

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                  step.number < currentStep
                    ? 'bg-green-500 text-white'
                    : step.number === currentStep
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.number < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.1 }}
                className={`text-xs mt-2 font-medium whitespace-nowrap ${
                  step.number <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {step.label}
              </motion.p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 relative">
                <div className="absolute inset-0 bg-gray-200" />
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: step.number < currentStep ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="absolute inset-0 bg-green-500 origin-left"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressIndicator
