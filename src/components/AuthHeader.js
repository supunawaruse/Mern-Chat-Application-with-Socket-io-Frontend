import React from 'react'

const AuthHeader = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-5">
      <h2 className='primary-text' >{title}</h2>
      {subtitle && <h6 className="secondary-text">{subtitle}</h6>}
    </div>
  )
}

export default AuthHeader