// ** Configs
import { ACCESS_TOKEN, REFRESH_TOKEN, TEMPORARY_TOKEN, USER_DATA, PRE_GOOGLE_TOKEN } from 'src/configs/auth'
import { LOCAL_PRODUCT_CART } from 'src/configs/product'
// ** Types
import { TItemOrderProduct } from 'src/types/order-product'

export const setLocalUserData = (userData: string, accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(USER_DATA, userData)
    window.localStorage.setItem(ACCESS_TOKEN, accessToken)
    window.localStorage.setItem(REFRESH_TOKEN, refreshToken)
  }
}
export const getLocalUserData = () => {
  if (typeof window !== 'undefined') {
    return {
      userData: window.localStorage.getItem(USER_DATA),
      accessToken: window.localStorage.getItem(ACCESS_TOKEN),
      refreshToken: window.localStorage.getItem(REFRESH_TOKEN)
    }
  }

  return {
    userData: '',
    accessToken: '',
    refreshToken: ''
  }
}
export const clearLocalUserData = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(USER_DATA)
    window.localStorage.removeItem(ACCESS_TOKEN)
    window.localStorage.removeItem(REFRESH_TOKEN)
  }
}
export const setTemporaryToken = (accessToken: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(TEMPORARY_TOKEN, accessToken)
  }
}

export const getTemporaryToken = () => {
  if (typeof window !== 'undefined') {
    return {
      temporaryToken: window.localStorage.getItem(TEMPORARY_TOKEN)
    }
  }

  return {
    temporaryToken: ''
  }
}

export const clearTemporaryToken = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(TEMPORARY_TOKEN)
  }
}
export const setLocalProductToCart = (data: Record<string, TItemOrderProduct[]>) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCAL_PRODUCT_CART, JSON.stringify(data))
  }
}

export const getLocalProductCart = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(LOCAL_PRODUCT_CART)
  }

  return ''
}
export const setLocalPreTokenGoogle = (token: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(PRE_GOOGLE_TOKEN, token)
  }
}
export const clearLocalPreTokenGoogle = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(PRE_GOOGLE_TOKEN)
  }
}
export const getLocalPreTokenGoogle = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(PRE_GOOGLE_TOKEN)
  }

  return ''
}
