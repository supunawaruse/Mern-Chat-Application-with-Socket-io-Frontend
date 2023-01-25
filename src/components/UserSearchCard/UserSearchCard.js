import React from 'react'
import { useGlobal } from '../../contexts/GlobalContext'
import './UserSearchCard.css'

const UserSearchCard = ({user}) => {
    const {theme} = useGlobal()
  return (
    <div className={`row ${theme === 'dark' ? 'dark-search-card' : 'light-search-card'}`}>
        <div className='col-2'>
            <img src={user.profileImg.url} width={40} height={40} alt="" className='user-img me-2' />
        </div>
        <div className='col-10' style={{position:'relative'}}>
            <p className='small-font-size primary-text mb-0'>{user.username}</p>
            <p className='mini-font-size secondary-text mb-0'>{user.desc}</p>
        </div>
    </div>
  )
}

export default UserSearchCard