// ** React
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'

// ** Config
import authConfig, { LIST_PAGE_PUBLIC } from 'src/configs/auth'

// ** Types
import {
  AuthValuesType,
  LoginParams,
  ErrCallbackType,
  UserDataType,
  LoginGoogleParams,
  LoginFacebookParams
} from './types'

// ** Services
import { loginAuth, loginAuthGoogle, loginAuthFacebook, logoutAuth } from 'src/services/auth'

// ** Config
import { API_ENDPOINT } from 'src/configs/api'
import { ROUTE_CONFIG } from 'src/configs/route'

// ** Helper
import { clearLocalUserData, setLocalUserData, setTemporaryToken } from 'src/helpers/storage'

// Instance axios
import instanceAxios from 'src/helpers/axios'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// ** Redux
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import { updateProductToCart } from 'src/stores/order-product'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  loginGoogle: () => Promise.resolve(),
  loginFacebook: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  const { t } = useTranslation()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

      if (storedToken) {
        setLoading(true)
        await instanceAxios
          .get(API_ENDPOINT.AUTH.AUTH_ME)
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.data })
          })
          .catch(e => {
            clearLocalUserData()
            setUser(null)
            setLoading(false)
            if (!router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    loginAuth({ email: params.email, password: params.password, deviceToken: params?.deviceToken })
      .then(async response => {
        if (params.rememberMe) {
          setLocalUserData(JSON.stringify(response.data.user), response.data.access_token, response.data.refresh_token)
        } else {
          setTemporaryToken(response.data.access_token)
        }

        toast.success(t('Login_success'))

        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.user })
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
      })

      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLoginGoogle = (params: LoginGoogleParams, errorCallback?: ErrCallbackType) => {
    loginAuthGoogle({ idToken: params.idToken, deviceToken: params.deviceToken })
      .then(async response => {
        if (params.rememberMe) {
          setLocalUserData(JSON.stringify(response.data.user), response.data.access_token, response.data.refresh_token)
        } else {
          setTemporaryToken(response.data.access_token)
        }
        toast.success(t('Login_success'))
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.user })
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL as string)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }
  const handleLoginFacebook = (params: LoginFacebookParams, errorCallback?: ErrCallbackType) => {
    loginAuthFacebook({ idToken: params.idToken, deviceToken: params.deviceToken })
      .then(async response => {
        if (params.rememberMe) {
          setLocalUserData(JSON.stringify(response.data.user), response.data.access_token, response.data.refresh_token)
        } else {
          setTemporaryToken(response.data.access_token)
        }
        toast.success(t('Login_success'))
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.user })
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL as string)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    logoutAuth().then(res => {
      setUser(null)
      clearLocalUserData()

      if (!LIST_PAGE_PUBLIC?.some(item => router.asPath?.startsWith(item))) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: ROUTE_CONFIG.LOGIN,
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace(ROUTE_CONFIG.LOGIN)
        }
      }
      dispatch(
        updateProductToCart({
          orderItems: []
        })
      )
    })
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    loginGoogle: handleLoginGoogle,
    loginFacebook: handleLoginFacebook,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
