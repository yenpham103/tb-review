import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from './providers'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Team Review - Chia sẻ ý kiến",
  description: "Nền tảng chia sẻ ý kiến và thảo luận cho team",
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}