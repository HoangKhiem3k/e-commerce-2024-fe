// ** React
import { ReactElement, ReactNode, useEffect } from 'react'
// ** Types
import { useAuth } from 'src/hooks/useAuth'
import { useSession } from 'next-auth/react'
import { clearLocalRememberLoginAuthSocial, clearTemporaryToken } from 'src/helpers/storage'

interface NoGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const NoGuard = (props: NoGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const { status } = useSession()
  useEffect(() => {
    const handleUnload = () => {
      if (status !== 'loading') {
        clearTemporaryToken()
        clearLocalRememberLoginAuthSocial()
      }
    }
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      window.addEventListener('beforeunload', handleUnload)
    }
  }, [])
  if (auth.loading) {
    return fallback
  }

  return <>{children}</>
}

export default NoGuard
