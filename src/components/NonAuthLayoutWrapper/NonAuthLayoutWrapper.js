import React, { useState } from 'react'
import { Col, Container, Row,Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './NonAuthLayoutWrapper.css'
import authImage from "../../assets/images/auth-img.png";
import { useGlobal } from '../../contexts/GlobalContext';

const NonAuthLayoutWrapper = (props) => {
  const {theme,setTheme} = useGlobal()
  const [checkToggle,setCheckToggle] = useState(theme === 'light' ? false : true)
  
  const onThemeChange =(e)=>{
    if(e.target.checked){
      setTheme('dark')
      setCheckToggle(true)
    }else{
      setTheme('light')
      setCheckToggle(false)
    }
  }

  return (
    <div className='non-auth-wrapper'>
      <Container fluid className='p-0'>
        <Row className='g-0' >
          <Col xl={3} lg={4} className="pt-4 pt-lg-0">
            <div className="p-4 pb-0 p-lg-5 pb-lg-0 auth-logo-section">
              <div className="text-white-50">
                <h2>
                  <Link  style={{textDecoration:'none'}} to="/" className="text-white">
                    <i className="bi bi-chat-left-text-fill logo-color" /> WeChat
                  </Link>
                </h2>
                <h6>
                  Best Place To Hangout With Your Friends
                </h6>
              </div>
              <div className="mt-auto d-none d-lg-block">
                <img src={authImage} alt="auth" className="auth-img" />
              </div>
            </div>
          </Col>
          <Col xl={9} lg={8} className="mt-4 mt-lg-0">
            <div className="authentication-page-content">
              <div className="d-flex flex-column h-100 px-5 pt-4 px-sm-4 ">
                {props.children}
                <Row className="">
                  <Col xl={12}>
                    <Form style={{color:'white',display:'flex',justifyContent:'center'}}>
                      <Form.Check 
                        type="switch"
                        id="custom-switch"
                        label="Change Theme"
                        className='primary-text'
                        checked={checkToggle}
                        onChange={(e)=>onThemeChange(e)}
                      />
                    </Form>
                    <div className="text-center text-muted p-4">
                      <p className="mb-0">
                        &copy; {new Date().getFullYear()} WeChat. Crafted with <i className="bi bi-heart-fill" />
                        <i className="mdi mdi-heart text-danger"></i> by
                        Supuna Warusawithana
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default NonAuthLayoutWrapper