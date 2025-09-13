import React from 'react'
import { Route, Routes } from 'react-router'
import EventosList from './EventosList'
import EventosCreateOrUpdate from './EventosCreateOrUpdate'

const Eventos = () => {
  return (
    <Routes>
        <Route path='' element={<EventosList/>}/>
        <Route path='/criar' element={<EventosCreateOrUpdate/>}/>
        <Route path='/editar/:idEvento' element={<EventosCreateOrUpdate/>}/>
    </Routes>
  )
}

export default Eventos