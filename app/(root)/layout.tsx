import React, { ReactNode } from 'react'
import { Toaster } from 'sonner'

const RootLayout = ({children}:{children: ReactNode}) => {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  )
}

export default RootLayout
