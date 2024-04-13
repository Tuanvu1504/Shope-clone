import { createContext, useState } from 'react'
import { ExtraPurchase } from 'src/types/purchase.type'
import User from 'src/types/user.type'
import { getAccessTokenFromLS, getUserFromLS } from 'src/utils/auth'

interface AppContextProps {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
  extraPurchaseList: ExtraPurchase[]
  setExtraPurchaseList: React.Dispatch<React.SetStateAction<ExtraPurchase[]>>
  reset: () => void
}

export const getInitialAppContext: () => AppContextProps = () => ({
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  user: getUserFromLS(),
  setUser: () => null,
  extraPurchaseList: [],
  setExtraPurchaseList: () => null,
  reset: () => null
})
const initialAppContext = getInitialAppContext()
export const AppContextProvider = createContext(initialAppContext)

export default function AppContext({
  children,
  defaultValue = initialAppContext
}: {
  children: React.ReactNode
  defaultValue?: AppContextProps
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    defaultValue.isAuthenticated
  )
  const [user, setUser] = useState<User>(defaultValue.user)
  const [extraPurchaseList, setExtraPurchaseList] = useState<ExtraPurchase[]>(
    defaultValue.extraPurchaseList
  )

  const reset = () => {
    setIsAuthenticated(false), setExtraPurchaseList([])
  }
  return (
    <AppContextProvider.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        extraPurchaseList,
        setExtraPurchaseList,
        reset
      }}
    >
      {children}
    </AppContextProvider.Provider>
  )
}
