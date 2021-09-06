import type { ChangeEventHandler, FC } from 'react'

interface InputProps {
  id: string
  placeholder?: string
  type: string
  value: string | number
  onChange: ChangeEventHandler<HTMLInputElement>
}

const Input: FC<InputProps> = ({ id, placeholder, type, value, onChange }) => (
  <input
    type={type}
    className="px-1 h-7 bg-yellow-100 border-gray-400"
    min="0"
    id={id}
    placeholder={placeholder || ''}
    value={value}
    onChange={onChange}
  />
)

export default Input
