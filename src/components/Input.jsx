import { forwardRef } from 'react'

const Input = forwardRef((
  {
    type = 'text',
    placeholder,
    error,
    className = '',
    ...props
  },
  ref
) => {
  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      className={`input-field ${
        error ? 'input-error' : ''
      } ${className}`}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export default Input
