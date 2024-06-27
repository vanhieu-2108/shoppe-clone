export interface ErrorResponse<Data> {
  message: string
  data?: Data
}

export interface SuccessResponse<Data> {
  message: string
  data: Data
}

export type NoUndefiendField<T> = {
  [P in keyof T]-?: NoUndefiendField<NonNullable<T[P]>>
}
