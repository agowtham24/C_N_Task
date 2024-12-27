export interface AddUser {
  name: string;
  email: string;
  password: string;
  loginCount?: number;
  role: string;
}
export interface UpdateUser {
  name?: string;
  email?: string;
  password?: string;
  loginCount?: number;
  role?: string;
}
