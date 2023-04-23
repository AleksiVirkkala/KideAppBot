'use client'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  disabled?: boolean
}

export const Button = ({ label, disabled = false, ...buttonProps }: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300 disabled:text-gray-500"
      {...buttonProps}
    >
      {label}
    </button>
  )
}
