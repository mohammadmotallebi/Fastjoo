import React from "react"
import type {Metadata} from 'next'
import {Roboto} from 'next/font/google'
import {Providers} from "@redux/provider";
import '@/app/globals.css'

const roboto = Roboto({weight:'400',style:"normal", subsets: ['latin-ext'] })

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (

        <html lang="en">
        <body className={roboto.className}>
        <Providers>{children}</Providers>
        </body>
        </html>

    )
}