import React from 'react'
import SideMenu from '../components/SideMenu/SideMenu'

const LayoutIndex = (props) => {
  return (
    <div className='d-lg-flex'>
        <SideMenu />
        {props.children}
    </div>
  )
}

export default LayoutIndex