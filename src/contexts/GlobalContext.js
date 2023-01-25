import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext({
  activeTab:null,
  setActiveTab: () => {},
  theme:null,
  setTheme:()=>{},
  chats:[],
  setChats:()=>{},
  selectedChat:null,
  setSelectedChat: ()=>{},
  notifications:[],
  setNotifications: () =>{}

});

export const useGlobal = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {

    const [activeTab,setActiveTab] = useState('pills-user')
    const [theme,setTheme] = useState('dark')
    const [selectedChat,setSelectedChat] = useState(null)
    const [chats,setChats] = useState([])
    const [notifications,setNotifications] = useState([])
    
    return(
        <GlobalContext.Provider value={{activeTab,setActiveTab,theme,setTheme,selectedChat,setSelectedChat,chats,setChats, notifications, setNotifications}}>
            { children }
        </GlobalContext.Provider>
    )
}

export const GlobalConsumer = GlobalContext.Consumer;
export default GlobalProvider;