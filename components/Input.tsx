import type { ChangeEventHandler, FC } from 'react'

interface InputProps {
  id?: string
  placeholder?: string
  type: string
  value: string | number
  onChange: ChangeEventHandler<HTMLInputElement>
  extraClasses?: string
}

const Input: FC<InputProps> = ({ id, placeholder, type, value, onChange, extraClasses }) => (
  <input
    type={type}
    className={`px-1 h-7 bg-yellow-100 border-gray-400 ${extraClasses || ''}`}
    min="0"
    id={id || ''}
    placeholder={placeholder || ''}
    value={value}
    onChange={onChange}
  />
)

export default Input
