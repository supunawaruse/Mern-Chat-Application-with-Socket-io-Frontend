import React, { useEffect, useState, useRef } from 'react'
import { useGlobal } from '../../contexts/GlobalContext'
import './Index.css'
import LeftBar from './LeftBar/LeftBar'
import { FormControl, Dropdown, Spinner, Form } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import Lottie from "react-lottie";
import { findSender } from '../../utils/ChatUtils'
import UserProfileSideBar from '../../components/UserProfileSideBar/UserProfileSideBar'
import MessageCard from '../../components/MessageCard/MessageCard'
import { getAllMessages, sendMessage } from '../../services/MessageService'
import io from 'socket.io-client'
import animationData from "../../animations/typing.json";
import Welcome from './Welcome/Welcome'
import { useSocket } from '../../contexts/SocketContext'
import Picker from 'emoji-picker-react';

var selectedChatCompare;

const Index = () => {

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { userData } = useAuth()
  const { socket } = useSocket()
  const { selectedChat, setSelectedChat, notifications, setNotifications, setChats, chats } = useGlobal()
  const [sender, setSender] = useState()
  const [showChatDetails, setUserChatDetails] = useState(false)

  const messagesEndRef = useRef(null)

  const [allMessages, setAllMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const[showEmojis, setShowEmojis] = useState(false)

  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [typingRoom, setTypingRoom] = useState()

  const onCloseChatDetails = () => setUserChatDetails(false)
  const onOpenChatDetails = () => setUserChatDetails(true)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [allMessages]);

  useEffect(() => {

    socket?.emit("setup", userData);
    socket?.on("connected", () => setSocketConnected(true));
    socket?.on("typing", (room, userId) => {
      if (userId !== userData._id) {
        setTypingRoom(room)
        setIsTyping(true)
      } else {
        setTypingRoom()
        setIsTyping(false)
      }
    });
    socket?.on("stop typing", () => setIsTyping(false));

  }, [])

  useEffect(() => {
    if (selectedChat !== null) {
      setSender(findSender(selectedChat.users, userData))
    }
    fetchAllMessages()
    selectedChatCompare = selectedChat;
  }, [selectedChat])

  useEffect(() => {

    socket?.on("message recieved", (newMessageRecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        if (!notifications.includes(newMessageRecieved)) {
          setNotifications([newMessageRecieved, ...notifications]);
        }
      } else {
        setAllMessages([...allMessages, newMessageRecieved]);
      }

      if (!chats.find((c) => c._id === newMessageRecieved.chat._id)) {
        newMessageRecieved.chat.latestMessage = newMessageRecieved
        setChats([newMessageRecieved.chat, ...chats])
      } else {
        let relevatChat = chats.filter((c) => c._id === newMessageRecieved.chat._id)[0]
        let ch = { ...relevatChat, latestMessage: newMessageRecieved }
        setChats([ch, ...chats.filter((c) => c._id !== newMessageRecieved.chat._id)])
      }
    });
  });


  useEffect(() => {
    socket.on("message deleted", (newMessageDeleted,newLatestMessage) => {
      
      const newChats = chats.map((c) => {
        if (c.latestMessage._id === newMessageDeleted._id) {
              c.latestMessage = newLatestMessage
              return c
        }else{
          return c
        }
      })
      setChats(newChats)

      if (selectedChat && (selectedChat._id === newMessageDeleted.chat._id)) {
        setAllMessages(allMessages.filter((m) => m._id !== newMessageDeleted._id))
      }

    });
  })

  const onClickBack = () => {
    setSelectedChat(null)
  }

  const onEmojiClick = (event, emojiObject) =>{
    setMessage(message + emojiObject.emoji)
  }

  const typingHandler = (e) => {
    var timeout
    setMessage(e.target.value)

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id, userData._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  }

  const fetchAllMessages = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      setLoading(true)
      const allMessages = await (await getAllMessages({ chatId: selectedChat._id })).data.data
      setAllMessages(allMessages)
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const onSendMessage = async () => {

    if (message === "") {
      return "Empty String"
    }
    socket.emit("stop typing", selectedChat._id);

    try {
      setMessage("")
      const res = await (await sendMessage({ content: message, chatId: selectedChat._id })).data.data
      socket.emit("new message", res);
      setAllMessages([...allMessages, res])
      // let relevatChat = chats.filter((c) => c._id === selectedChat._id)[0]
      // let ch = { ...relevatChat, latestMessage: res }
      // setChats([ch, ...chats.filter((c) => c._id !== selectedChat._id)])
      setChats(
        chats.map((c) => {
          if (c._id === selectedChat._id) {
            c.latestMessage = res
            return c;
          } else {
            return c;
          }
        })
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <LeftBar />
      <div className={`user-chat ${selectedChat !== null && 'user-chat-show'}`}>
        {
          selectedChat !== null ? (
            <>
              <div className='user-chat-header row mx-0'>
                <div className='col-6 p-0 d-flex align-items-center' role="button" onClick={() => setSelectedChat(null)}>
                  <i className="bi bi-caret-left-fill" style={{ fontSize: 20 }}></i>
                  <div className='ms-3 p-0'>
                  <img src={selectedChat.isGroupChat ? 'https://res.cloudinary.com/dle7urchd/image/upload/v1652769875/weChat/WeChat_wkmeg2.png' : sender?.profileImg.url} width={40} height={40} alt="" className='user-img me-2' />
                </div>
                <div className='ms-2'>
                  <h6 className='mb-0 mini-bold-text big-font-size'>{selectedChat.isGroupChat ? selectedChat.chatName : sender?.username}</h6>
                  {
                    !selectedChat.isGroupChat ? (
                      <>
                        {
                          sender?.activeStatus ? (
                            <span className='mini-font-size'><i className="bi bi-circle-fill" style={{ fontSize: 12, color: `${sender?.activeStatus === 'Active' ? '#06D6A0' : sender?.activeStatus === 'Away' ? '#FFD166' : '#EF476F'}` }}></i>&nbsp;{sender?.activeStatus}</span>
                          ) : (
                            <span className='mini-font-size'>New Chat</span>
                          )
                        }
                      </>
                    ) : (
                      <span className='mini-font-size'>Group Chat</span>
                    )
                  }

                  {(istyping && (typingRoom === selectedChat._id)) ? (

                    <Lottie
                      options={defaultOptions}
                      width={40}
                      height={20}
                      style={{ position: 'absolute', top: 38, left: -4 }}
                    />

                  ) : (
                    <></>
                  )}
                </div>
                </div>
                <div className='col-6 text-end'>
                  <Dropdown className='profile-dropdown'>
                    <Dropdown.Toggle variant="success" id="dropdown-basic" className='profile-dropdown-button'>
                      <i className="bi bi-three-dots-vertical ms-3" style={{ fontSize: 20 }}></i>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className='profile-menu'>
                      <Dropdown.Item className='profile-dropdown-item' href="#/action-1" onClick={onOpenChatDetails}>
                        {
                          selectedChat.isGroupChat ? (
                            <span className='small-font-size'>Group Info</span>
                          )
                            : (
                              <span className='small-font-size'>Contact Info</span>
                            )
                        }

                      </Dropdown.Item>
                      <Dropdown.Item className='profile-dropdown-item' href="#/action-1">
                        {
                          selectedChat.isGroupChat ? (
                            <span className='small-font-size'>Delete Group</span>
                          )
                            : (
                              <span className='small-font-size'>Delete Chat</span>
                            )
                        }

                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                </div>
              </div>
              <div className='user-chat-body p-3'>
                {
                  loading ? (
                    <div className='text-center'>
                      <Spinner animation="border" size="sm" variant="white" />
                    </div>

                  ) : (
                    <>
                      {
                        allMessages.map((m, idx) => (
                          <MessageCard key={idx} message={m} index={idx} messages={allMessages} setAllMessages={setAllMessages} />
                        ))
                      }
                    </>
                  )
                }


                <div ref={messagesEndRef}></div>
              </div>
              <div className='user-chat-footer row mx-0'>
                <div className='col-2 col-lg-1 text-center p-0'>
                  <i className="bi bi-three-dots me-3" style={{ fontSize: 20 }}></i>
                  <i className="bi bi-emoji-laughing" style={{ fontSize: 20 }} onClick={()=>setShowEmojis(!showEmojis)} role="button"></i>
                  {
                    showEmojis && (
                      <div className='emoji-box' style={{width:280,height:350,position:'absolute', bottom:80}}>
                       <i className="bi bi-x emoji-box-cancel" onClick={()=>setShowEmojis(false)} role="button"></i>
                      <Picker groupVisibility={false} disableSearchBar disableSkinTonePicker onEmojiClick={onEmojiClick} pickerStyle={{position:'absolute',bottom:0, border:'none',boxShadow:'none'}} />
                      </div>
                    )
                  }
                </div>
                <div className='col-8 col-lg-10 p-0'>
                  <Form onSubmit={(e)=>{e.preventDefault(); onSendMessage();}} >
                  <FormControl placeholder="Message here.." className='chat-input' value={message} onChange={typingHandler} />
                  </Form>
                </div>
                <div className='col-2 col-lg-1 text-center p-0'>
                  <i className="bi bi-mic me-3" style={{ fontSize: 20 }}></i>
                  <i className="bi bi-send-fill" style={{ fontSize: 22 }} onClick={onSendMessage} role="button"></i>
                </div>
              </div>
            </>
          ) : (
            <Welcome />
          )
        }
      </div>
      {
        showChatDetails && (<UserProfileSideBar onClose={onCloseChatDetails} userDetails={!selectedChat.isGroupChat && sender} />)
      }

    </>
  )
}

export default Index