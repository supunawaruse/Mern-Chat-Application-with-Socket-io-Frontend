import React from 'react'
import './Profile.css'
import { useAuth } from '../../../contexts/AuthContext'

const Profile = () => {
  const { userData } = useAuth()
  return (
    <div className='profile-tab'>
      <div className='profile-header'>
        <p className='profile-header-text'>My Profile</p>
        <img src={require('../../../assets/images/small/img-4.jpg')} alt="profile" className="profile-backImg" />
        <div className='profile-overlay' />
      </div>

      <div className='profile-image row p-3 text-center'>
        <div className='profile-thumbnail mb-3'>
          <img src={userData.profileImg.url} alt="" className='profile-img' />
        </div>
        <p className='primary-text mb-0 semi-bold-text'>{userData.username}</p>
        <p className='secondary-text small-font-size'>{userData.desc}</p>
      </div>
      <div className='profile-details row p-4 mini-font-size'>
        <p className='mb-1 secondary-text'><i className="bi bi-person-fill"></i> Username</p>
        <p className='primary-text'>{userData.username}</p>
        <p className='mb-1 secondary-text'><i className="bi bi-envelope-fill"></i> Email</p>
        <p className='primary-text' >{userData.email}</p>
        <p className='mb-1 secondary-text'><i className="bi bi-phone-fill"></i> Contact No</p>
        <p className='primary-text'>{userData.contactNo ? userData.contactNo : "Update your contact details"}</p>
        <p className='mb-1 secondary-text'><i className="bi bi-geo-alt-fill"></i> Location</p>
        <p className='primary-text'>{userData.location ? userData.location : "Update your location"}</p>
      </div>

    </div>
  )
}

export default Profile