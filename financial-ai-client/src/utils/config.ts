import { ErrorType } from "@/type/dto/dto"

export const FINANCIAL_BACKEND_URL='http://localhost:8080/api'

export const FINANCIAL_AI_URL= 'http://localhost:3000/api'

export  function handleError(e:ErrorType) {
    return e.data
}