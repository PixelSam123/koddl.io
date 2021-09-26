import type { ChangeEventHandler, FC } from 'react'

interface InputProps {
  id?: string
  placeholder?: string
  type: string
  value: string | number
  onChange: ChangeEventHandler<HTMLInputElement>
  extraClasses?: string
  required?: boolean
}

const Input: FC<InputProps> = ({
  id,
  placeholder,
  type,
  value,
  onChange,
  extraClasses,
  required,
}) => (
  <input
    type={type}
    className={`px-1 h-7 bg-yellow-100 border-gray-400 ${extraClasses || ''}`}
    min="0"
    id={id || ''}
    placeholder={placeholder || ''}
    value={value}
    onChange={onChange}
    required={required}
  />
)

export default Input
