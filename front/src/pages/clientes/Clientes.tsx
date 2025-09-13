import React from 'react'
import { Route, Routes } from 'react-router'
import ClientesList from './ClientesList'
import ClientesCreateOrUpdate from './ClientesCreateOrUpdate'

const Clientes = () => {
  return (
    <Routes>
        <Route path='' element={<ClientesList/>}/>
        <Route path='/criar' element={<ClientesCreateOrUpdate/>}/>
        <Route path='/editar/:idCliente' element={<ClientesCreateOrUpdate/>}/>
    </Routes>
  )
}

export default Clientes