import axios from './ApiService';

export const accessChat = ({userId}) => axios.post('/chats',{userId:userId})
export const fetchChats = () => axios.get('/chats')
export const createGroupChat = ({users,chatName}) => axios.post('/chats/group',{users,chatName})
export const renameGroup = (payload) => axios.put('/chats/rename',payload)
export const removeFromGroup = ({chatId,userId}) => axios.put('/chats/remove-from-group',{chatId:chatId,userId:userId})
export const addToGroup = ({chatId,users}) => axios.put('/chats/add-to-group',{chatId:chatId,users:users})
export const changeLatestMessage = ({chatId,latestMessage}) => axios.put('/chats/change-latest-message',{chatId:chatId,latestMessage:latestMessage})