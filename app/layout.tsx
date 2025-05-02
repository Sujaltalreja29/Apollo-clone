import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Apollo 247 - Find General Physicians & Internal Medicine Specialists",
  description:
    "Consult with top general physicians and internal medicine specialists. Book appointments online with experienced doctors.",
  keywords: "general physician, internal medicine, doctor consultation, online doctor, apollo 247",
  openGraph: {
    title: "Apollo 247 - Find General Physicians & Internal Medicine Specialists",
    description:
      "Consult with top general physicians and internal medicine specialists. Book appointments online with experienced doctors.",
    url: "https://www.apollo247.com/specialties/general-physician-internal-medicine",
    siteName: "Apollo 247",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Apollo 247",
      },
    ],
    locale: "en_US",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
