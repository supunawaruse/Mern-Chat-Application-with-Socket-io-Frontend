import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { Nav, NavItem, Dropdown, NavLink, Tooltip, OverlayTrigger, Modal, Button, Form, Spinner } from 'react-bootstrap'
import { MENU_ITEMS } from './Menu'
import './SideMenu.css'
import { useGlobal } from '../../contexts/GlobalContext'
import { useAuth } from '../../contexts/AuthContext'
import { useSocket } from '../../contexts/SocketContext'
import { changePassword } from '../../services/UserServices'
import { toast } from "react-toastify";

const renderTooltip = ({ text }) => (
  <Tooltip id="button-tooltip" className='side-menu-tooltip' >
    {text}
  </Tooltip>
);

const MenuNavItem = ({ item, selectedTab, onChangeTab }) => {

  const onClick = () => {
    onChangeTab(item.tabId)
  }
  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 250, hide: 100 }}
      overlay={renderTooltip({ text: item.tooltipTitle })}
    >
      <NavItem className={item.className} id={`${item.key}-container`}>
        <NavLink
          className='side-menu-icons'
          href="#"
          active={selectedTab === item.tabId}
          id={item.key}
          role="tab"
          onClick={onClick}
        >
          <i className={`${item.icon}`} style={selectedTab === item.tabId ? { color: '#4eac6d', fontSize: 24 } : { color: '#878a92', fontSize: 24 }} ></i>
        </NavLink>
      </NavItem>
    </OverlayTrigger>
  );
}

const LightDarkModeChanger = () => {

  const { theme, setTheme } = useGlobal();

  const onClick = () => {
    if (theme === 'light') {
      setTheme('dark')
    }
    if (theme === 'dark') {
      setTheme('light')
    }
  }

  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 250, hide: 100 }}
      overlay={renderTooltip({ text: 'Change Theme' })}
    >
      <NavItem>
        <NavLink
          active={false}
          className='side-menu-icons'
          href="#"
          role="tab"
          onClick={onClick}
        >
          <i className={`${theme === 'light' ? 'bi bi-moon' : 'bi bi-sun'}`} style={{ color: '#4eac6d', fontSize: 24 }}></i>
        </NavLink>
      </NavItem>
    </OverlayTrigger>
  );
}

const ProfileDropdownMenu = ({ onChangeTab, onChangePassoword }) => {
  const { logout,userData } = useAuth();
  const { socket } = useSocket()
  const { setChats, setNotifications, setSelectedChat } = useGlobal()
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  const onLogoutClick = () => {
    socket.emit("logout", userData )
    setChats([])
    setNotifications([])
    setSelectedChat(null)
    logout()
  }

  const onChangePw = () => {
    onChangePassoword()
  }

  return (
    <Dropdown className='profile-dropdown'>
      <Dropdown.Toggle variant="success" id="dropdown-basic" className='profile-dropdown-button'>
        <img src={userData.profileImg.url} alt="" className="profile-user rounded-circle" />
      </Dropdown.Toggle>

      <Dropdown.Menu className='profile-menu'>
        <Dropdown.Item className='profile-dropdown-item' href="#/action-1" onClick={onChangePw}>
          <span className='small-font-size me-3'>Change Password</span>
          <i className="bi bi-lock small-font-size"></i>
        </Dropdown.Item>
        <Dropdown.Item className='profile-dropdown-item' href="#/action-1" onClick={onLogoutClick}>
          <span className='small-font-size me-3'>Logout</span>
          <i className="bi bi-box-arrow-left small-font-size"></i>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>

  )
}

const SideMenu = () => {
  const { activeTab, setActiveTab, theme } = useGlobal();
  const { userData } = useAuth()

  const [show, setShow] = useState(false);
  const handleClose = () => {setShow(false);  setPayload({currentPassword: '', newPassword: '', confirmPassword: ''});}
  const handleShow = () => setShow(true);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  const onChangeTab = (id) => {
    setActiveTab(id)
  }

  const onChangePassword = async () => {
    try {
      if(payload.newPassword !== payload.confirmPassword){
        toast.error("Your password and confirmation password do not match");
        return;
      }else{
        await (await changePassword(payload, userData._id)).data.data
        handleClose()
        setPayload({currentPassword: '', newPassword: '', confirmPassword: ''})
        toast.success("Successfully Changed Your Password");
      }
    } catch (error) {
      toast.error("Something Error. Try Again");
      console.log(error)
    }finally{
      setPayload({currentPassword: '', newPassword: '', confirmPassword: ''})
    }
  }

  return (
    <div className="side-menu flex-lg-column">
      <Modal centered show={show} onHide={handleClose} className="modal-main">
      <Form onSubmit={(e) => { e.preventDefault(); onChangePassword();}} className='main-form'>
        <Modal.Header closeButton className={theme === 'dark' ? 'modal-header-dark' : 'modal-header-light'} >
          <Modal.Title className='big-font-size'>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body className={theme === 'dark' ? 'modal-body-dark' : 'modal-body-light'}>
         
            <Form.Group className="mb-3">
              <Form.Label className='semi-bold-text small-font-size' style={theme === 'light' ? { color: '#495057' } : { color: '#8f9198' }}>Current Password</Form.Label>
              <Form.Control className=' main-form-input secondary-text small-font-size' type="password" placeholder="Current Password" value={payload.currentPassword} onChange={(e) => setPayload({ ...payload, currentPassword: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className='semi-bold-text small-font-size' style={theme === 'light' ? { color: '#495057' } : { color: '#8f9198' }}>New Password</Form.Label>
              <Form.Control className=' main-form-input secondary-text small-font-size' type="password" placeholder="New Password"  value={payload.newPassword} onChange={(e) => setPayload({ ...payload, newPassword: e.target.value })}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className='semi-bold-text small-font-size' style={theme === 'light' ? { color: '#495057' } : { color: '#8f9198' }}>Confirm Password</Form.Label>
              <Form.Control className=' main-form-input secondary-text small-font-size' type="password" placeholder="Confirm Password" value={payload.confirmPassword} onChange={(e) => setPayload({ ...payload, confirmPassword: e.target.value })}/>
            </Form.Group>
          
        </Modal.Body>
        <Modal.Footer className={theme === 'dark' ? 'modal-footer-dark' : 'modal-footer-light'}>
          <Button variant="secondary secondary-button" size='lg' className='main-form-cancel' onClick={handleClose}>
            Close
          </Button>
          <Button type='submit' variant="primary primary-button" size='lg' className='main-form-submit'>
            {
              loading ? <Spinner animation="border" size="sm" variant="white" /> : 'Change Password'
            }
          </Button>
        </Modal.Footer>
        </Form>
      </Modal>
      <div className="flex-lg-column my-0 sidemenu-navigation">
        <Nav variant='pills' className="side-menu-nav" role="tablist">
          <i className="bi bi-chat-square-text-fill d-none d-lg-block" style={{ color: '#4eac6d', fontSize: 24 }}></i>
          {(MENU_ITEMS || []).map((item, key) => (
            <MenuNavItem
              item={item}
              key={key}
              selectedTab={activeTab}
              onChangeTab={onChangeTab}
            />
          ))}
          <LightDarkModeChanger />
          <ProfileDropdownMenu onChangeTab={onChangeTab} onChangePassoword={handleShow} />
        </Nav>
      </div>
    </div>
  )
}

export default SideMenu