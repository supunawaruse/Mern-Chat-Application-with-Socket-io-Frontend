import React,{useState} from 'react'
import './LeftBar.css'
import {Tab} from 'react-bootstrap'
import { useGlobal } from '../../../contexts/GlobalContext'
import Chats from '../Chats/Chats'
import Contacts from '../Contacts/Contacts'
import Profile from '../Profile/Profile'
import Settings from '../Settings/Settings'

const LeftBar = () => {
    const {activeTab} = useGlobal();
  
    return (
    <div className="chat-leftsidebar">
        <Tab.Container id="left-tabs-example" defaultActiveKey={'pills-user'} activeKey={activeTab} >
            <Tab.Content>
                <Tab.Pane eventKey="pills-user" role="tabpanel" aria-labelledby="pills-user-tab">
                    <Profile />
                </Tab.Pane>
                <Tab.Pane eventKey="pills-chats" role="tabpanel" aria-labelledby="pills-chats-tab">
                    <Chats />
                </Tab.Pane>
                <Tab.Pane eventKey="pills-contacts" role="tabpanel" aria-labelledby="pills-contacts-tab">
                    <Contacts />
                </Tab.Pane>
                <Tab.Pane eventKey="pills-settings" role="tabpanel" aria-labelledby="pills-settings-tab">
                    <Settings />
                </Tab.Pane>
            </Tab.Content>
      </Tab.Container>
    </div>
  )
}

export default LeftBar