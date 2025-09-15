import React from 'react'
import Input from '../components/Input'
import { useForm } from 'react-hook-form'

const AuthLayout = ({children}) => {

  return (
    <main className='flex flex-col bg-azul print:bg-white h-[100dvh] p-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-4'>
      <div className='h-1/4 lg:h-1/3 flex items-center justify-center flex-col lg:items-end mb-8 print:hidden' >
        <img src="/logo_branca.png" className='h-full'  alt="" />
        <h1 className='text-4xl  font-bold text-white relative -top-14 lg:right-20'>SenacPass</h1>
      </div>
      <div className='bg-white/70 print:bg-white rounded-md flex flex-col p-12 justify-center lg:w-1/2'>
        {children}
      </div>
    </main>
  )
}

export default AuthLayout