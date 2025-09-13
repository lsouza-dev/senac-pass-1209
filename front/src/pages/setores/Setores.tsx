import React from 'react'
import { Route, Routes } from 'react-router'
import SetoresList from './SetoresList'
import SetoresCreateOrUpdate from './SetoresCreateOrUpdate'

const Setores = () => {
  return (
    <Routes>
        <Route path='' element={<SetoresList/>}/>
        <Route path='/criar' element={<SetoresCreateOrUpdate/>}/>
        <Route path='/editar/:idSetor' element={<SetoresCreateOrUpdate/>}/>
    </Routes>
  )
}

export default Setores