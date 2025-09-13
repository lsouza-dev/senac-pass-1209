import React from 'react'
import { Route, Routes } from 'react-router'
import UsuariosList from './UsuariosList'
import UsuariosCreateOrUpdate from './UsuariosCreateOrUpdate'

const Usuarios = () => {
  return (
    <Routes>
        <Route path='' element={<UsuariosList/>}/>
        <Route path='/criar' element={<UsuariosCreateOrUpdate/>}/>
        <Route path='/editar/:idUsuario' element={<UsuariosCreateOrUpdate/>}/>
    </Routes>
  )
}

export default Usuarios