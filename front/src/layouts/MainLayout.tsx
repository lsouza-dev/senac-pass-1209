import { Armchair, Calendar, Ticket, User, UserRound, UserStar } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'

const MainLayout = ({children}) => {
  return (
    <main className='bg-azul h-[100dvh] grid grid-cols-[25rem_1fr] print:block print:bg-white'>
        <header className='text-white print:hidden'>
          <div className='flex flex-col items-start justify-center'>
            <img src="/logo_branca.png" className='h-[13rem]' alt="" />
            <h1 className='text-3xl font-bold relative  -right-8 -top-10'>SenacPass</h1>
          </div>
          <nav className='flex flex-col gap-4 *:inline-flex text-2xl font-bold *:items-center px-6 *:gap-2 *:hover:translate-x-3 *:transition-all '>
            <Link to={'/usuarios'}><UserStar size={30} /><span>Usuarios</span></Link>
            <Link to={'/clientes'}><User size={30} /><span>Clientes</span></Link>
            <Link to={'/eventos'}><Calendar size={30} /><span>Eventos</span></Link>
            <Link to={'/setores'}><Armchair size={30} /><span>Setores</span></Link>
            <Link to={'/reservas'}><Ticket size={30} /><span>Reservas</span></Link>
          </nav>
        </header>
        <section className='bg-white  '>
            <div className='flex  gap-4 items-center justify-end px-6  border-b-cinza border print:hidden'>
                <div className='flex flex-col gap-2 p-2 px-6 border-r-1 border-cinza'>
                  <p className='text-lg'>Luiz Fabiano de Souza</p>
                  <span className='text-sm'>Administrador</span>
                </div>
                <div>
                  <div className='border rounded-full p-1'>
                    <UserRound />
                    </div>
                </div>
            </div>
            <div className='p-6 max-h-[50rem] overflow-auto'>

            {children}
            </div>
        </section>
    </main>
  )
}

export default MainLayout