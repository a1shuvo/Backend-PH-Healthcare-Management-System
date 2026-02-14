export interface IRegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

export interface IUserLoginPayload {
  email: string;
  password: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
