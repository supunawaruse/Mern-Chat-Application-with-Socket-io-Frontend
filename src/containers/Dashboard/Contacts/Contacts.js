import React, { useState, useEffect } from 'react'
import './Contacts.css'
import { FormControl } from 'react-bootstrap'
import ChatCard from '../../../components/ChatCard/ChatCard'
import { getUsers } from '../../../services/UserServices'
import { useGlobal } from '../../../contexts/GlobalContext'
import { useAuth } from '../../../contexts/AuthContext'
import { accessChat } from '../../../services/ChatServices'



const Contacts = () => {
  const {userData} = useAuth()
  const {setSelectedChat,chats,setChats} = useGlobal()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    getAllUsers();
  }, [])

  const sortUsers = (list) => {
    const sortedArray = list.sort(function (a, b) {
      const nameA = a.username.toUpperCase(); // ignore upper and lowercase
      const nameB = b.username.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    const data = sortedArray.reduce((r, e) => {
      let key = e.username[0].toUpperCase()

      if (!r[key]) {
        r[key] = { key, usersList: [e] }
      } else {
        r[key].usersList.push(e)
      }
      return r;
    }, {})
    return Object.values(data)
  }

  const getAllUsers = async () => {
    try {
      const allUsers = await (await getUsers('')).data.data
      setUsers(sortUsers(allUsers))
      setSearch('')
    } catch (error) {
      console.log(error)
    }
  }

  const onSearch = async () => {
    try {
      const allUsers = await (await getUsers(search)).data.data
      setUsers(sortUsers(allUsers))
    } catch (error) {
      console.log(error)
    }
  }

  const onClickContact = async(user) => {
    try {
      const chat = await (await accessChat({userId:user._id})).data.data
      setSelectedChat(chat)
      console.log(chat)
      if(!chats.find((c)=> c._id === chat._id )){
        setChats([chat,...chats])
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className='contacts-tab p-3'>
      <div className='contacts-header py-2'>
        <h5 className='tab-header-text'>Contacts</h5>
        <div className='contacts-search row'>
          <div className='col-9 p-0'>
            <FormControl placeholder="Search here.." className='contacts-input' value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {
            search !== '' ? (
              <div className='col-1 p-0' onClick={getAllUsers} >
              <i className="bi bi-x-lg search-icon"></i>
            </div>
            ):(
              <div className='col-1 p-0'></div>
            )
          }
         
          <div className='col-2 p-0' onClick={onSearch}>
            <i className="bi bi-search search-icon"></i>
          </div>
        </div>

        <div className='scroll-view mt-3'>
          {
            users.length > 0 && users.map((u, idx) => {
              return (
                <div key={idx}>
                  <p className='mb-2 theme-text'>{u.key}</p>
                  {
                    u.usersList.map((ul, i) => (
                      <div key={i} className='row align-items-center mb-3' onClick={()=> onClickContact(ul)} role='button'>
                        <div className='col-2 p-0'>
                          <img src={ul.profileImg.url} width={30} height={30} alt="" className='me-2' style={{ borderRadius: '50%' }} />
                        </div>
                        <div className='col-10 p-0'>
                          <span className='primary-text mini-font-size mini-bold-text'>{ul.username}</span>
                          <p className='m-0 mb-1 micro-font-size secondary-text'>{ul.desc.length > 35 ? ul.desc.substring(0,32)+'...' : ul.desc }</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Contacts