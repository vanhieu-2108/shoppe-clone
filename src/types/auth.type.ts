import { User } from './user.type'
import { SuccessResponse } from './utils.type'
export type AuthResponse = SuccessResponse<{
  refresh_token: string
  access_token: string
  expires_refresh_token: number
  expires: number
  user: User
}>

export type RefreshTokenResponse = SuccessResponse<{
  access_token: string
}>
