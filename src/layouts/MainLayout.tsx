import type { ReactNode } from 'react'
import { Header } from '../components/Header'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
