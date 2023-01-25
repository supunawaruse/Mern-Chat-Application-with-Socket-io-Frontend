import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { isLastMessage, isSameSender } from '../../utils/ChatUtils'
import { Modal, Button, Spinner } from 'react-bootstrap'
import './MessageCard.css'
import { useGlobal } from '../../contexts/GlobalContext'
import { deleteMessage } from '../../services/MessageService'
import { useSocket } from '../../contexts/SocketContext'
import { changeLatestMessage } from '../../services/ChatServices'

const MessageCard = ({ message, index, messages, setAllMessages }) => {
    const { userData } = useAuth()
    const { theme,selectedChat, setChats, chats } = useGlobal()
    const {socket} = useSocket()
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true);

    const onSelectMessage = () => {
        if (message.sender._id === userData._id) {
            handleShow()
        }
    }

    const onDeleteMessage = async () => {
        setLoading(true)
        try {
            let messagesCount = messages.length
            let newLatestMessage = messages[messagesCount-2]
            if(selectedChat.latestMessage._id === message._id){
                const updateChat = (await changeLatestMessage({chatId:selectedChat._id,latestMessage:newLatestMessage})).data.data
                setChats(chats.map((c)=>{
                    if(c._id === selectedChat._id){
                        c.latestMessage = newLatestMessage
                        return c
                    }else{
                        return c
                    }
                }))
            }
            await deleteMessage({ messageId: message._id })
            socket.emit("delete message", message, newLatestMessage);
            setAllMessages(messages.filter((m)=> m._id !== message._id))
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
            handleClose()
        }
    }

    return (
        <>
            <Modal centered show={show} onHide={handleClose} className="modal-main">
                <Modal.Header closeButton className={theme === 'dark' ? 'modal-header-dark' : 'modal-header-light'} >
                    <Modal.Title>Delete Message?</Modal.Title>
                </Modal.Header>
                <Modal.Footer className={theme === 'dark' ? 'modal-footer-dark' : 'modal-footer-light'}>
                    <Button variant="secondary secondary-button" className='main-form-cancel' onClick={handleClose}>
                        Close
                    </Button>
                    <Button type='submit' className='main-form-submit' style={{ backgroundColor: '#424548', border: 'none', fontSize: 14, color: "white" }} onClick={onDeleteMessage}>
                        {
                            loading ? <Spinner animation="border" size="sm" variant="white" /> : 'Delete'
                        }
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className={`row ${message.sender._id === userData._id ? 'message-card-right' : 'message-card-left'}`}>
                <div className={` ${!isSameSender(messages, message, index) ? 'message-card-content-hidden' : 'message-card-content'}  `}>

                    <div className='chat-img'>
                        {
                            (isSameSender(messages, message, index) || isLastMessage(messages, index)) ? (
                                <img src={message.sender.profileImg.url} width={30} height={30} alt="" className='chat-card-img me-2' />
                            ) : (
                                <img src={message.sender.profileImg.url} width={30} height={30} alt="" className='chat-card-img-hidden me-2' />

                            )
                        }
                    </div>

                    <div className='chat-message'>
                        <div className='chat-wrap'>
                            <div className='wrap-content' onClick={onSelectMessage}>
                                <span className='mb-0 big-font-size'>{message.content}</span>
                            </div>
                            <div className='wrap-content-hidden'></div>

                        </div>

                        {
                            (isSameSender(messages, message, index) || isLastMessage(messages, index)) ? (
                                <div className='chat-text'>
                                    <span className='small-font-size'>{message.sender.username}: </span><small>{message.createdAt.substring(12, 16)}</small>
                                </div>
                            ) : (
                                <div className='chat-text-hidden'>
                                    {message.sender.username} <small>{message.createdAt.substring(12, 16)}</small>
                                </div>
                            )
                        }

                    </div>
                </div>
            </div>
        </>
    )
}

export default MessageCard