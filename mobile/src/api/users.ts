// // src/api/users.ts
// import axios from 'axios';
// import { User } from '../types';

// const BASE_URL = 'http://localhost:3000';

// export const getUsers = async (token: string): Promise<User[]> => {
//   const res = await axios.get(`${BASE_URL}/users`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return res.data;
// };


// src/api/users.ts
import client from './client';
import { User } from '../types';

export const getUsers = async (): Promise<User[]> => {
  const res = await client.get('/users');
  return res.data;
};
