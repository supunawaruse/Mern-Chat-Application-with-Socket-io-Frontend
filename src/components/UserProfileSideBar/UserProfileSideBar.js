import React, { useState } from 'react'
import { Modal, Button, Form, ListGroup, Spinner } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { useGlobal } from '../../contexts/GlobalContext'
import { addToGroup, fetchChats, removeFromGroup } from '../../services/ChatServices'
import { getUsers } from '../../services/UserServices'
import UserDetailsCard from '../UserDetailsCard/UserDetailsCard'
import UserSearchCard from '../UserSearchCard/UserSearchCard'
import './UserProfileSideBar.css'

const UserProfileSideBar = ({ onClose, userDetails }) => {
    const { userData } = useAuth()
    const { selectedChat, setSelectedChat, theme, chats, setChats } = useGlobal()
    const [addedUsers, setAddedUsers] = useState([])
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
        if (selectedChat.users.find((u) => u._id === user._id)) {
        } else {
            if (!addedUsers.find((c) => c._id === user._id)) {
                setAddedUsers([user, ...addedUsers])
            }
        }
    }

    const AddedUsers = ({ user }) => {
        const onDeleteUsers = () => {
            setAddedUsers(addedUsers.filter((u) => u._id !== user._id))
        }
        return (
            <div className='row p-1 mb-2 align-items-center text-center added-users' onClick={onDeleteUsers}>
                <div className='col-12'>
                    <p className='mb-0'>{user.username.length > 6 ? `${user.username.substring(0, 6)}...` : user.username}</p>
                </div>
            </div>
        )
    }

    const onClickClose = () => onClose();

    const onAddNewsUser = async () => {
        try {
            setLoading(true)
            await addToGroup({ chatId: selectedChat._id, users: addedUsers })
            const allChats = await (await fetchChats()).data.data
            setChats(allChats)
            setSelectedChat(allChats.filter((c) => c._id === selectedChat._id)[0])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
            setAddedUsers([])
            setSearchResult([])
            handleClose()
        }
    }

    const onRemove = async (userId) => {
        try {
            if (userData._id === selectedChat.groupAdmin._id) {
                setLoading(true)
                await (await removeFromGroup({ chatId: selectedChat._id, userId: userId })).data.data
                const allChats = await (await fetchChats()).data.data
                setChats(allChats)
                setSelectedChat(allChats.filter((c) => c._id === selectedChat._id)[0])
            } else {
                console.log('Only Admins Can Remove Users')
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='user-profile-sidebar p-3'>
            <Modal centered show={show} onHide={handleClose} className="modal-main">
                <Modal.Header closeButton className={theme === 'dark' ? 'modal-header-dark' : 'modal-header-light'} >
                    <Modal.Title>Add Users</Modal.Title>
                </Modal.Header>
                <Modal.Body className={theme === 'dark' ? 'modal-body-dark' : 'modal-body-light'}>
                    <Form className='main-form'>
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
                    <Button type='submit' variant="primary primary-button" className='main-form-submit' onClick={onAddNewsUser}>
                        {
                            loading ? <Spinner animation="border" size="sm" variant="white" /> : 'Add Users'
                        }
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className='user-header'>
                <img src={selectedChat.isGroupChat ? 'https://res.cloudinary.com/dle7urchd/image/upload/v1652769875/weChat/WeChat_wkmeg2.png' : userDetails.profileImg.url} alt="profile" className="profile-backImg" />
                <div className='profile-overlay' />
                <div className='row profile-details'>
                    <div className='col-12'>
                        <i role="button" className="bi bi-arrow-left" style={{ color: 'white', fontSize: 18 }} onClick={onClickClose} />
                    </div>
                    <div className='col-12' style={{ alignSelf: 'flex-end' }}>
                        <p className='mb-0 white-text semi-bold-text'>{selectedChat.isGroupChat ? selectedChat.chatName : userDetails.username}</p>
                        {
                            !selectedChat.isGroupChat ? (
                                <span className='mini-font-size'><i className="bi bi-circle-fill" style={{ fontSize: 10, color: `${userDetails.activeStatus === 'Active' ? '#06D6A0' : userDetails.activeStatus === 'Away' ? '#FFD166' : '#EF476F'}` }}></i>&nbsp;{userDetails.activeStatus}</span>
                            ) : (
                                <span className='mini-font-size'>Group Chat</span>
                            )
                        }
                    </div>
                </div>
            </div>
            {
                !selectedChat.isGroupChat ? (
                    <>
                        <div className='user-details mt-4'>
                            <p className='mb-1 primary-text mini-font-size semi-bold-text'>STATUS:</p>
                            <p className='mb-1 secondary-text mini-font-size mini-bold-text'>If several languages coalesce, the grammar of the resulting.</p>
                            <p className='mb-1 primary-text mini-font-size semi-bold-text mt-4'>INFO:</p>
                            <p className='mb-1 secondary-text mini-font-size mini-bold-text'>Username</p>
                            <p className='primary-text mini-font-size semi-bold-text'>{userDetails.username}</p>
                            <p className='mb-1 secondary-text mini-font-size mini-bold-text'>Email</p>
                            <p className='primary-text mini-font-size semi-bold-text' >supunawa@gmail.com</p>
                            <p className='mb-1 secondary-text mini-font-size mini-bold-text'>Description</p>
                            <p className='primary-text mini-font-size semi-bold-text' >{userDetails.desc}</p>

                            {
                                userDetails.contactNo !== '' && (
                                    <>
                                        <p className='mb-1 secondary-text mini-font-size mini-bold-text'>Contact No</p>
                                        <p className='primary-text mini-font-size semi-bold-text'>{userDetails.contactNo}</p>
                                    </>
                                )
                            }
                            {
                                userDetails.location !== '' && (
                                    <>
                                        <p className='mb-1 secondary-text mini-font-size mini-bold-text'>Location</p>
                                        <p className='primary-text mini-font-size semi-bold-text'>{userDetails.location}</p>
                                    </>
                                )
                            }
                        </div>
                    </>
                ) : (
                    <div className='user-details mt-4'>
                        <p className='mb-1 primary-text small-font-size semi-bold-text'>USERS:</p>
                        <div className='row mt-4 mb-4 align-items-center px-2' role="button" onClick={handleShow}>
                            <div className='col-2 text-center'>
                                <span className='add-users-btn' ><i className="bi bi-person-fill"></i></span>
                            </div>
                            <div className='col-10'>
                                <p className='small-font-size primary-text mb-0'>Add Users...</p>
                            </div>
                        </div>
                        <div className='px-2' style={{ borderRadius: 10, backgroundColor: '#262626' }}>
                            {
                                selectedChat.users.map((user, idx) => (
                                    <UserDetailsCard key={idx} user={user} onRemove={() => onRemove(user._id)} />
                                ))
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default UserProfileSideBar