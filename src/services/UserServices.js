import axios from './ApiService';

export const login = (payload) => axios.post(`/users/login`, payload);
export const register = (payload) => axios.post(`/users/register`, payload);
export const changePassword = (payload,userId) => axios.put(`/users/change-password/${userId}`,payload);
export const updateUser = (payload,userId) => axios.put(`/users/update/${userId}`,payload);
export const updateUserStatus = (userId,activeStatus) => axios.put(`/users/update-status/${userId}`,{activeStatus});
export const updateUserProfileImg = (userId,profileImg) => axios.put(`/users/change-profileImg/${userId}`,{profileImg});
export const getUsers = (search) => axios.get(`/users?search=${search}`)