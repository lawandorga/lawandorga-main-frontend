import { Permission, Rlc } from "@/types/core";
import { User } from "@/types/user";
import axios from "../api";

interface LoginResponse {
  token: string;
  key: string;
  user: User;
}

interface StaticsResponse {
  user: User;
  rlc: Rlc;
  notifications: number;
  permissions: string[];
  all_permissions: Permission[];
}

interface AdminInformation {
  profiles: number;
  record_deletion_requests: number;
  record_permit_requests: number;
}

class UserService {
  login(data: { email: string; password: string }): Promise<LoginResponse> {
    return axios
      .post<LoginResponse>(`profiles/login/`, data)
      .then((response) => response.data);
  }

  statics(token: string): Promise<StaticsResponse> {
    return axios
      .get<StaticsResponse>(`profiles/statics/${token}/`)
      .then((response) => response.data);
  }

  admin(): Promise<AdminInformation> {
    return axios
      .get<AdminInformation>("profiles/admin/")
      .then((response) => response.data);
  }

  // getPermissions(): Promise<Permission[]> {
  //   return axios.get<Permission[]>('permission')
  // }
}

export default new UserService();
