import React from 'react'
import { Route, Routes } from 'react-router'
import ReservasList from './ReservasList'
import ReservasCreateOrUpdate from './ReservasCreateOrUpdate'

const Reservas = () => {
  return (
    <Routes>
        <Route path='' element={<ReservasList/>}/>
        <Route path='/criar' element={<ReservasCreateOrUpdate/>}/>
        <Route path='/editar/:idReserva' element={<ReservasCreateOrUpdate/>}/>
    </Routes>
  )
}

export default Reservas