export interface User {
  id: number;
  email: string;
  name: string;
  rlc: number;
  rlc_user?: number;
}

export interface RlcUser {
  id: number;
  user: number;
  birthday: string;
  phone_number: string;
  street: string;
  city: string;
  postal_code: string;
  locked: boolean;
  email_confirmed: boolean;
  is_active: boolean;
  accepted: boolean;
}
