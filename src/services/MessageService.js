import axios from './ApiService';

export const sendMessage = ({content,chatId}) => axios.post('/messages',{content:content,chatId:chatId})
export const getAllMessages = ({chatId}) => axios.get(`/messages/${chatId}`)
export const deleteMessage = ({messageId}) => axios.delete(`/messages/${messageId}`)