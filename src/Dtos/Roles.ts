export interface AddRole {
  role: string;
  pagePermissions: string[];
}
export interface UpdateRole {
  role?: string;
  pagePermissions?: string[];
}
