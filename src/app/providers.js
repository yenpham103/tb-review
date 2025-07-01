// src/app/providers.js
'use client'
import { SessionProvider } from 'next-auth/react'
import { SocketProvider } from '@/contexts/SocketContext'

export function Providers({ children }) {
    return (
        <SessionProvider>
            <SocketProvider>
                {children}
            </SocketProvider>
        </SessionProvider>
    )
}