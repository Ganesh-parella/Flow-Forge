import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './router';
import { RouterProvider } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
    <RouterProvider router={router}></RouterProvider>
    </ClerkProvider>
  </StrictMode>,
)
