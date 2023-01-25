import React, { useEffect, useState } from 'react'
import './Chats.css'
import { FormControl } from 'react-bootstrap'
import ChatCard from '../../../components/ChatCard/ChatCard'
import { useGlobal } from '../../../contexts/GlobalContext'
import { createGroupChat, fetchChats } from '../../../services/ChatServices'
import { findSender } from '../../../utils/ChatUtils'
import { useAuth } from '../../../contexts/AuthContext'
import { Modal, Form, Button, Spinner, ListGroup } from 'react-bootstrap'
import { getUsers } from '../../../services/UserServices'
import UserSearchCard from '../../../components/UserSearchCard/UserSearchCard'

const Chats = () => {
  const { userData } = useAuth()
  const { chats, setChats, theme ,selectedChat, notifications} = useGlobal()
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [addedUsers, setAddedUsers] = useState([])
  const [searchResult, setSearchResult] = useState([]);
  const [chatName, setChatName] = useState('')

  const handleClose = () => {
    setSearchResult([])
    setShow(false);
    setAddedUsers([])
  }
  const handleShow = () => setShow(true);

  useEffect(() => {
    getAllChats()
  }, [])

  const getAllChats = async () => {
    try {
      const chats = await (await fetchChats()).data.data
      setChats(chats)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = async (query) => {

    if (!query) {
      setSearchResult([])
      return;
    }

    try {
      const searchedUsers = await (await getUsers(query)).data.data
      setSearchResult(searchedUsers);
    } catch (error) {
      console.log(error)
    }
  }

  const onAddUser = (user) => {
    if (!addedUsers.find((c) => c._id === user._id)) {
      setAddedUsers([user, ...addedUsers])
    }
  }

  const onCreateGroup = async() =>{
    if(chatName === '' || addedUsers.length === 0){
      return;
    }

    try {
      const res = await (await createGroupChat({users:JSON.stringify(addedUsers.map((u)=> u._id)),chatName:chatName})).data.data
      setChats([res,...chats])
      handleClose()
      setChatName('')
      setAddedUsers([])
      setSearchResult([])
    } catch (error) {
        console.log(error)
    } 
  }

  const AddedUsers = ({ user }) => {

    const onDeleteUsers = () =>{
      setAddedUsers(addedUsers.filter((u)=> u._id !== user._id))
    }
  
    return (
      <div className='row p-1 mb-2 align-items-center text-center added-users' onClick={onDeleteUsers}>
        <div className='col-12'>
          <p className='mb-0'>{user.username.length > 6 ? `${user.username.substring(0, 6)}...` : user.username}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='chats-tab p-3'>
      <Modal centered show={show} onHide={handleClose} className="modal-main">
        <Modal.Header closeButton className={theme === 'dark' ? 'modal-header-dark' : 'modal-header-light'} >
          <Modal.Title>Create New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body className={theme === 'dark' ? 'modal-body-dark' : 'modal-body-light'}>
          <Form className='main-form'>
            <Form.Group className="mb-3">
              <Form.Label className='semi-bold-text small-font-size' style={theme === 'light' ? { color: '#495057' } : { color: '#8f9198' }}>Group Name</Form.Label>
              <Form.Control className=' main-form-input secondary-text small-font-size' type="text" placeholder="Group Name" value={chatName} onChange={(e) => setChatName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className='semi-bold-text small-font-size' style={theme === 'light' ? { color: '#495057' } : { color: '#8f9198' }}>Username</Form.Label>
              <Form.Control className=' main-form-input secondary-text small-font-size' type="text" placeholder="Add Users eg: John, Piyush, Jane" onChange={(e) => handleSearch(e.target.value)} />
            </Form.Group>
          </Form>
          {
            searchResult.length > 0 && (
              <ListGroup className='users-list'>
                {searchResult.map((result, idx) => (
                  <ListGroup.Item className={theme === 'dark' ? 'list-item-dark' : 'list-item-light'} role="button" key={idx} onClick={() => onAddUser(result)}>
                    <UserSearchCard user={result} />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )
          }
          {
            addedUsers.length > 0 ? (
              <div className='row mt-4 px-3'>
                {
                  addedUsers.map((user, idx) => (
                    <div className='col-3'>
                      <AddedUsers key={idx} user={user} />
                    </div>
                  ))
                }
              </div>
            ) : (
              <p className='small-font-size mt-3'>No Users Added Yet</p>
            )
          }

        </Modal.Body>
        <Modal.Footer className={theme === 'dark' ? 'modal-footer-dark' : 'modal-footer-light'}>
          <Button variant="secondary secondary-button" className='main-form-cancel' onClick={handleClose}>
            Close
          </Button>
          <Button type='submit' variant="primary primary-button" className='main-form-submit' onClick={onCreateGroup}>
            {
              loading ? <Spinner animation="border" size="sm" variant="white" /> : 'Create Group'
            }
          </Button>
        </Modal.Footer>
      </Modal>
      <div className='chat-header py-2'>
        <div className='row'>
          <div className='col-6'>
            <h5 className='tab-header-text mb-0'>Chats</h5>
          </div>
          <div className='col-6' onClick={handleShow}>
            <button className='group-create-btn'>+</button>
          </div>
        </div>
        <div className='chat-search row'>
          <div className='col-10 p-0'>
            <FormControl placeholder="Search here.." className='chat-input' />
          </div>
          <div className='col-2 p-0'>
            <i className="bi bi-search search-icon"></i>
          </div>
        </div>
        <div className='scroll-view mt-2 pb-4'>
          <div className='direct mt-4'>
            <p className='secondary-text semi-bold-text mini-font-size'>DIRECT MESSAGES</p>
            <div className='px-2'>
              {
                chats.length > 0 ? chats.map((chat, idx) => (
                  !chat.isGroupChat && (
                    <ChatCard key={idx} chat={chat} user={findSender(chat.users, userData)} />
                  )
                )) : (
                  <p>No Chats</p>
                )
              }
            </div>
            <p className='secondary-text semi-bold-text mini-font-size mt-5'>GROUP MESSAGES</p>
            <div className='px-2'>
              {
                chats.length > 0 ? chats.map((chat, idx) => (
                  chat.isGroupChat && (
                    <ChatCard key={idx} chat={chat} user={findSender(chat.users, userData)} />
                  )
                )) : (
                  <p>No Chats</p>
                )
              }
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Chats