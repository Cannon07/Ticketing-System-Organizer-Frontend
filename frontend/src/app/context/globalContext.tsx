"use client"

import { createContext, useContext, Dispatch, SetStateAction,useState, ReactNode } from "react";


interface OrganizerData {
  id: string,
  name: string,
  email: string,
  govId: string,
  walletId: string,
  transactionId: string,
  organisedEvents: string[]
  profileImg: string,
}

interface ContextProps{
    connectLoading: boolean,
    setConnectLoading: Dispatch<SetStateAction<boolean>>,
    organizerData: OrganizerData | null,
    setOrganizerData: Dispatch<SetStateAction<OrganizerData | null>>,
}

const GlobalContext = createContext<ContextProps>({
    connectLoading: false,
    setConnectLoading: (): boolean=>false,
    organizerData: null,
    setOrganizerData: (): OrganizerData | null => null,
})

interface GlobalContextProviderProps{
    children: ReactNode;
}

export const GlobalContextProvider = ({children}:GlobalContextProviderProps)=>{
    
    const [connectLoading, setConnectLoading] = useState(false);
    const [organizerData, setOrganizerData] = useState<OrganizerData | null>(null);

    return (
        <GlobalContext.Provider value = {{connectLoading,setConnectLoading,organizerData,setOrganizerData}}>

            {children}

        </GlobalContext.Provider>
    )
 }

 export const useGlobalContext = () => useContext(GlobalContext);