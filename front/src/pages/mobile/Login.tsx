import React, { useState } from 'react'
import Input from '../../components/Input'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-toastify'
import SweetAlert from '../../components/SweetAlert'
import { Navigate, useNavigate } from 'react-router'

const Login = () => {
  const {register,formState:{errors},handleSubmit} = useForm()
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()
  
  function redirectByProfile(){
    const user = JSON.parse(sessionStorage.getItem('user')!)

    switch(user.perfis.descricao){
      case 'Vendedor':
        navigate('/eventos')
        break;
      case 'Administrador':
        navigate('/eventos')
        break;
      default:
        navigate('/validador')
        break;
    }
  }

  const handleLogin = async (data) => {
    setLoading(true)
    console.log(data)
    await axios.post('http://localhost:3333/api/auth/login',data)
    .then(res => {
      if(res.data.success){
        toast.success(res.data.message)
        sessionStorage.setItem('user',JSON.stringify(res.data.data))
      }
    }).catch(err => {
      console.log(err.response)
      toast.error(err.response.data.message)
    })
    .finally(() => {
      setLoading(false)
    })
  }

  return (
    <>
    {loading && <SweetAlert isLoading modalVisible={loading} action={redirectByProfile} dados={null} />}
      <h1 className='text-center text-2xl font-bold'>Login</h1>
        <form onSubmit={handleSubmit(handleLogin)} className='flex flex-col gap-4'>
          <div>
            <Input style={{borderColor:'black'}} name={'login'} label={'Login'}  placeholder='Email/CPF' maxLength={255} register={register} validators={{required:true,maxLength:255}} errors={errors}  />
          </div>
          <div>
            <Input style={{borderColor:'black'}} type='password' name={'senha'} label={'senha'}  placeholder='Digite sua senha' maxLength={255} register={register} validators={{required:true,maxLength:255}} errors={errors}  />
          </div>
          <div className=' flex items-center justify-center'>
            <button type='submit' className="inline-flex items-center gap-2 justify-center cursor-pointer text-xl font-bold text-white bg-azul px-8 py-2 rounded-md">Entrar</button>
          </div>
        </form></>
  )
}

export default Login