'use client'

import { createContext, useContext } from 'react'

type NavbarContextValue = {
    isGreen: boolean
}

export const NavbarContext = createContext<NavbarContextValue>({ isGreen: false })

export function useNavbarContext() {
    return useContext(NavbarContext)
}
