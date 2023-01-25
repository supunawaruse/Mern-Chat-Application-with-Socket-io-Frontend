import React,{useEffect} from 'react'
import { useGlobal } from '../../contexts/GlobalContext'
import './ChatCard.css'

const ChatCard = ({chat,user}) => {
  const {setSelectedChat,notifications,setNotifications} = useGlobal()
  
  const onChatSelect = ()=>{
    setSelectedChat(chat)
    setNotifications(notifications.filter((n)=> n.chat._id !== chat._id))
  }

  const countNotifications = () => {
    const count = notifications.filter((n) => n.chat._id === chat._id)
    return count.length
  }

  return (
    <div className='chat-card row align-items-center' onClick={onChatSelect} role='button'>
        <div className='card-left col-2 p-0'>
            <img src={chat.isGroupChat ? 'https://res.cloudinary.com/dle7urchd/image/upload/v1652769875/weChat/WeChat_wkmeg2.png' : user.profileImg.url} width={30} height={30} alt="" className='chat-card-img me-2' />
        </div>
        <div className='card-left col-9 p-0'>
            <p className={`mini-font-size mini-bold-text message ${countNotifications() > 0 ? 'active-text' : 'primary-text'}`}>{chat.isGroupChat ? chat.chatName : user.username}</p>
            <span className={`micro-font-size mini-bold-text ${countNotifications() > 0 ? 'active-text' : 'secondary-text'}`}>{chat.latestMessage ? (chat.latestMessage.content.length > 35 ? chat.latestMessage.content.substring(0,32)+'...' : chat.latestMessage.content) : 'No any messages yet'}</span>
        </div>
        {
          countNotifications() !== 0 && (
            <div className='card-right col-1 p-0 text-center'>
            <span className='primary-text mini-font-size mini-bold-text'>{countNotifications()}</span>
           </div>
          ) 
        }
       
    </div>
  )
}

export default ChatCard