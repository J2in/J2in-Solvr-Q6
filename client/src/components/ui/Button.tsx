import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        padding: '8px 16px',
        backgroundColor: '#4F46E5',
        color: 'white',
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  )
}
