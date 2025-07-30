import type { FC, MouseEventHandler, PropsWithChildren } from 'react'

interface ButtonProps {
  extraClasses?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({ children, extraClasses, onClick, type }) => (
  <div className="text-center">
    <button
      onClick={onClick}
      type={type}
      className={`select-none font-heading rounded-xl px-4 py-2 font-semibold shadow-xs active:shadow-none active:py-[calc(0.5rem-1px)] active:mb-0.5 active:border-t-transparent border-t-2 border-t-slate-600 bg-slate-700 text-slate-100 ${
        extraClasses || ''
      }`}
    >
      {children}
    </button>
  </div>
)

export default Button
