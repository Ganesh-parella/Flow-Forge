import { useState } from 'react'

import './App.css'
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import Header from './components/ui/custom/header';
import { useUser } from '@clerk/clerk-react';
import { Toaster } from './components/ui/sonner';
function App() {
  
  const {user,isLoaded,isSignedIn}=useUser();
  if(!isSignedIn&&isLoaded)
  {
    return <Navigate to={'/auth/sign-in'}/>;
  }
  return (
    <>
      <Header/>
      <Outlet/>
      <Toaster/>
    </>
  )
}

export default App
