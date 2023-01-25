import React, { useState, useEffect } from 'react'
import './Settings.css'
import { Accordion, Dropdown, Modal, Button, Form, Spinner, ToastContainer } from 'react-bootstrap'
import { useAuth } from '../../../contexts/AuthContext'
import { useGlobal } from '../../../contexts/GlobalContext'
import { updateUser, updateUserStatus } from '../../../services/UserServices'
import { useSocket } from '../../../contexts/SocketContext'
import ImageCropper from '../../../components/ImageCropper/ImageCropper'
import ax from 'axios'


const Settings = () => {
  const { userData, setUserData } = useAuth();
  const { username, location, desc, contactNo } = userData
  const { theme } = useGlobal();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [payload, setPayload] = useState({ username, location, desc, contactNo });
  const [croppedImage, setCroppedImage] = useState();
  const [imageSrc, setImageSrc] = useState('')

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showImageChange, setShowImageChange] = useState(false);
  const handleCloseImageChange = () => setShowImageChange(false);
  const handleShowImageChange = () => setShowImageChange(true);


  const onUserStatusChange = async (text) => {

    try {
      await updateUserStatus(userData._id, text);
      setUserData({ ...userData, activeStatus: text })
    } catch (error) {
      console.log(error)
    }
  }

  const readFile = (file) => {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }


  const onImageUpload = async (file) => {
    if (file) {
      const imageDataUrl = await readFile(file)
      setImageSrc(imageDataUrl)
      handleShowImageChange()
    }
  }

  const onClickSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(payload, userData._id);
      setUserData({
        ...userData,
        username: payload.username,
        contactNo: payload.contactNo,
        desc: payload.desc,
        location: payload.location,
      })
      handleClose()
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='settings-tab'>
      <Modal show={showImageChange} onHide={handleCloseImageChange} className="modal-main">
        <Modal.Header closeButton className={theme === 'dark' ? 'modal-header-dark' : 'modal-header-light'}>
          <Modal.Title>Change User Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ImageCropper imageUrl={imageSrc} croppedImage={croppedImage} setCroppedImage={setCroppedImage} setShow={setShowImageChange} />
        </Modal.Body>
      </Modal>

      <Modal centered show={show} onHide={handleClose} className="modal-main">
        <Modal.Header closeButton className={theme === 'dark' ? 'modal-header-dark' : 'modal-header-light'} >
          <Modal.Title>Edit Personal Info</Modal.Title>
        </Modal.Header>
        <Modal.Body className={theme === 'dark' ? 'modal-body-dark' : 'modal-body-light'}>
          <div className='text-center d-flex justify-content-center'>
            <div className='profile-thumbnail mb-3'>
              <img src={userData.profileImg.url} alt="" className='profile-img' />
            </div>
          </div>
          <div className='text-center mb-3'>
            <input className='secondary-text small-font-size' type="file" accept='image/*' onChange={(e) => onImageUpload(e.target.files[0])} />
          </div>
          <Form className='main-form'>
            <Form.Group className="mb-3">
              <Form.Label className='semi-bold-text small-font-size' style={theme === 'light' ? { color: '#495057' } : { color: '#8f9198' }}>Username</Form.Label>
              <Form.Control className=' main-form-input secondary-text small-font-size' type="text" placeholder="Change Username" value={payload.username} onChange={(e) => setPayload({ ...payload, username: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className='semi-bold-text small-font-size' style={theme === 'light' ? { color: '#495057' } : { color: '#8f9198' }}>Description</Form.Label>
              <Form.Control className='secondary-text small-font-size' type="text" placeholder="Change Description" value={payload.desc} onChange={(e) => setPayload({ ...payload, desc: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className='semi-bold-text small-font-size' style={theme === 'light' ? { color: '#495057' } : { color: '#8f9198' }}>Contact No</Form.Label>
              <Form.Control className='secondary-text small-font-size' type="text" placeholder="Change Contact Details" value={payload.contactNo} onChange={(e) => setPayload({ ...payload, contactNo: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className='semi-bold-text small-font-size' style={theme === 'light' ? { color: '#495057' } : { color: '#8f9198' }}>Location</Form.Label>
              <Form.Control className='secondary-text small-font-size' type="text" placeholder="Change Location" value={payload.location} onChange={(e) => setPayload({ ...payload, location: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className={theme === 'dark' ? 'modal-footer-dark' : 'modal-footer-light'}>
          <Button variant="secondary secondary-button" className='main-form-cancel' onClick={handleClose}>
            Close
          </Button>
          <Button type='submit' variant="primary primary-button" className='main-form-submit' onClick={onClickSave}>
            {
              loading ? <Spinner animation="border" size="sm" variant="white" /> : 'Save'
            }
          </Button>
        </Modal.Footer>
      </Modal>
      <div className='settings-header'>
        <p className='settings-header-text'>Settings</p>
        <img src={require('../../../assets/images/small/img-4.jpg')} className="settings-backImg" />
        <div className='settings-overlay' />
      </div>

      <div className='settings-image row p-3 text-center'>
        <div className='settings-thumbnail mb-3'>
          <img src={userData.profileImg.url} alt="" className='settings-img' />
        </div>
        <p className='primary-text mb-0 semi-bold-text big-font-size'>{userData.username}</p>
        <Dropdown className='profile-dropdown'>
          <Dropdown.Toggle variant="success" id="dropdown-basic" className='profile-dropdown-button primary-text'>
            <span className='small-font-size'><i className="bi bi-circle-fill" style={{ fontSize: 14, verticalAlign: 'middle', color: `${userData.activeStatus === 'Active' ? '#06D6A0' : userData.activeStatus === 'Away' ? '#FFD166' : '#EF476F'}` }}></i>&nbsp; {userData.activeStatus}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu className='profile-menu'>
            <Dropdown.Item className='profile-dropdown-item' onClick={() => onUserStatusChange("Active")} >
              <span><i className="bi bi-circle-fill" style={{ fontSize: 14, color: '#06D6A0', verticalAlign: 'middle' }}></i>&nbsp; Active</span>
            </Dropdown.Item>
            <Dropdown.Item className='profile-dropdown-item' onClick={() => onUserStatusChange("Away")}>
              <span><i className="bi bi-circle-fill" style={{ fontSize: 14, color: '#FFD166', verticalAlign: 'middle' }}></i>&nbsp; Away</span>
            </Dropdown.Item>
            <Dropdown.Item className='profile-dropdown-item' onClick={() => onUserStatusChange("Do not disturb")}>
              <span><i className="bi bi-circle-fill" style={{ fontSize: 14, color: '#EF476F', verticalAlign: 'middle' }}></i>&nbsp; Do not disturb</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className='settings-details row p-4 small-font-size'>
        <div className='settings-details-wrapper'>
          <Accordion className='accordion-styles' defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <i className="bi bi-person-fill me-2"></i>
                <span className='small-font-size'>Personal Info</span>
              </Accordion.Header>
              <Accordion.Body>
                <div className='personal-info'>
                  <div className='edit-button' onClick={handleShow}><i className="bi bi-pencil-fill"></i></div>
                  <p className='mb-1 secondary-text small-font-size'>Username</p>
                  <p className='primary-text mini-font-size'>{userData.username}</p>
                  <p className='mb-1 secondary-text small-font-size'>Email</p>
                  <p className='primary-text mini-font-size' >{userData.email}</p>
                  <p className='mb-1 secondary-text small-font-size'>Description</p>
                  <p className='primary-text mini-font-size' >{userData.desc}</p>
                  <p className='mb-1 secondary-text small-font-size'>Contact No</p>
                  <p className='primary-text mini-font-size'>{userData.contactNo ? userData.contactNo : "Update your contact Details"}</p>
                  <p className='mb-1 secondary-text small-font-size'>Location</p>
                  <p className='primary-text mini-font-size'>{userData.location ? userData.location : "Update your location"}</p>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <i className="bi bi-shield-fill-check me-2"></i>
                <span className='small-font-size'>Help</span>
              </Accordion.Header>
              <Accordion.Body>
                <span className='small-font-size'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</span> 
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </div>
  )
}

export default Settings