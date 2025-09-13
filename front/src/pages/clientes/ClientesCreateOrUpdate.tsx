import axios from 'axios';
import { Link, PenBox, Plus, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import Input from '../../components/Input';

const ClientesCreateOrUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes]: any = useState([]);
  const {register,reset,handleSubmit,formState:{errors},getValues} = useForm()
  const {idCliente } = useParams()
  const navigate = useNavigate()


  async function obterCliente() {
    await axios
      .get(`http://localhost:3333/api/clientes/${idCliente}`)
      .then((res) => {
        setClientes(res.data.data);
        if (res.data.success) {
          toast.success(res.data.message);
          reset(res.data.data)
        } else toast.warning("Nenhum usuário cadastrado/ativo no momento");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });

  }

  async function criarCliente(data) {
    // data['perfis']['id_perfil'] = Number(data['perfis']['id_perfil'])
    // data['id_perfil'] = data['perfis']['id_perfil']
    data['id_perfil'] = Number(data['id_perfil'])
    await axios
    .post(`http://localhost:3333/api/clientes`,data)
    .then((res) => {
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/clientes')
      }
    })
    .catch((err) => {
      console.log(err.response.data);
      toast.error(err.response.data.message);
    });
  }
  async function editarCliente(data) {
    data['perfis']['id_perfil'] = Number(data['perfis']['id_perfil'])
    data['id_perfil'] = data['perfis']['id_perfil']
    await axios
      .put(`http://localhost:3333/api/clientes/${idCliente}`,data)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          navigate('/clientes')
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        toast.error(err.response.data.message);
      });
  }

  useEffect(() => {
    if(idCliente){
      obterCliente();
    }
  }, []);

  return (
    <div className="grid gap-12">
      <h1 className='text-4xl font-bold'>{idCliente ? 'Editar Cliente' : 'Criar Cliente'}</h1>
      <div className="w-full max-h-[50rem] overflow-auto">
        <form onSubmit={idCliente ? handleSubmit(editarCliente) : handleSubmit(criarCliente)}>
          <div className='grid grid-cols-2 gap-4'>
            {idCliente && <div className='col-1'>
              <Input disabled={true} name={'id_cliente'} errors={errors} label={'ID Perfil'} placeholder={'Perfil do Cliente editado'} register={register} validators={{required:true}}/>
            </div>}
            <div className='col-1'>
              <Input name={'nome'} errors={errors} label={'nome'} placeholder={'Digite o nome do usuário'} register={register} validators={{required:true,maxLength:255}} maxLength={255}/>
            </div>
            {!idCliente && <div className='col-1'>
              <Input name={'cpf'} errors={errors} type='text' mask='cpf' label={'cpf'} placeholder={'Digite apenas números'} register={register} validators={{required:true,maxLength:14}} maxLength={14}/>
            </div>}
            <div className='col-1'>
              <Input name={'telefone'} errors={errors} type='text' mask='telefone' label={'telefone'} placeholder={'Digite o telefone do usuário'} register={register} validators={{required:true,maxLength:14}} maxLength={14}/>
            </div>
            <div className='col-1'>
              <Input name={'email'} errors={errors} label={'email'} type='email' placeholder={'Digite o email do usuário'} register={register} validators={{required:true,maxLength:255}} maxLength={255}/>
            </div>
          </div>
          <div className='text-end'>
            <button type='submit' className='bg-azul text-white rounded-md px-8 py-2 text-2xl'> {idCliente ? 'Editar' :'Criar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default ClientesCreateOrUpdate