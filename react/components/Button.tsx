import type { FC, MouseEventHandler } from 'react'

interface ButtonProps {
  extraClasses?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
}

const Button: FC<ButtonProps> = ({ children, extraClasses, onClick, type }) => (
  <button
    onClick={onClick}
    type={type}
    className={`bg-gray-600 hover:bg-gray-500 active:bg-gray-700 transition-colors rounded-md text-white px-1 py-0.5 ${
      extraClasses || ''
    }`}
  >
    {children}
  </button>
)

export default Button
