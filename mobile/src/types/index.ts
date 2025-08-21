export interface AuthResponse {
  token: string;
  user: User;
}


export interface User {
  _id: string;
  username: string;
  email: string;
  online: boolean;
}

export type MsgStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  _id: string;
  text: string;
  status: MsgStatus;
  createdAt: string;
  updatedAt: string;
  sender: string | { _id: string; username?: string; email?: string };
  receiver: string | { _id: string; username?: string; email?: string };
}
