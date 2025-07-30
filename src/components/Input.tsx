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
    className={`rounded-xl border-0 border-b-2 border-slate-700 bg-slate-900 p-2 shadow-inner ${extraClasses || ''}`}
    min="0"
    id={id || ''}
    placeholder={placeholder || ''}
    value={value}
    onChange={onChange}
    required={required}
  />
)

export default Input
