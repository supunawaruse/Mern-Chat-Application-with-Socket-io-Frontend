import React from 'react'
import { useGlobal } from '../../../contexts/GlobalContext'
import './Welcome.css'

const Welcome = () => {

    return (
        <div className='welcome'>
            <div className='middle-icon'>
                <i className="bi bi-chat-square-text-fill" style={{fontSize:32,color:'#4eac6d'}}></i>
            </div>
            <div className='middle-content'>
               <h5 className='primary-text'>Welcome to WeChat App</h5>
               <span className='primary-text small-font-size'>WeChat is a platform that any user can visit to make connections with other people who are working to a specific goal.</span>
            </div>
        </div>
    )
}

export default Welcome