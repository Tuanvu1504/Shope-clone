export interface SuccessResponseAPI<Data> {
  message: string
  data: Data
}

export interface ErrorResponseAPI<Data> {
  message: string
  data?: Data
}

export type RemoveUndefined<T> = {
  [K in keyof T]-?: Exclude<T[K], undefined>
}
