export interface JwtPayload {
  id: number;
  role_id: number;
  role : string;
  last_password_update: number;
  device: string;
}
