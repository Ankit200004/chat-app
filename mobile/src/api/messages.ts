import client from './client';
import { Message } from '../types';

export const getConversation = async (partnerId: string): Promise<Message[]> => {
  const res = await client.get(`/conversations/${partnerId}/messages`);
  return res.data;
};

export const sendMessage = async (partnerId: string, text: string): Promise<Message> => {
  const res = await client.post(`/conversations/${partnerId}/messages`, { text });
  return res.data;
};
