import React from 'react'
import { useGlobal } from '../../contexts/GlobalContext'
import './UserDetailsCard.css'

const UserDetailsCard = ({user,onRemove}) => {
  const {selectedChat} = useGlobal()

  const onUserRemove = () =>{
    onRemove();
  }

  return (
    <div className='row user-details-card'>
        <div className='col-2'>
            <img src={user.profileImg.url} width={40} height={40} alt="" className='user-img me-2' />
        </div>
        <div className='col-10' style={{position:'relative'}}>
            <p className='small-font-size primary-text mb-0'>{user.username}</p>
            <p className='mini-font-size secondary-text mb-0'>{user.desc}</p>
            {
              selectedChat.groupAdmin._id === user._id ? (
                <span className='admin-text'>Group Admin</span>
              ):(
                <span role='button' className='remove-button' onClick={onUserRemove}>remove</span>
              )
            }
        </div>
    </div>
  )
}

export default UserDetailsCard