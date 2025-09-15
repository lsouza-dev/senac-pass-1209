import axios from 'axios';
import { Link, PenBox, Plus, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import Input from '../../components/Input';

const UsuariosCreateOrUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios]: any = useState([]);
  const {register,reset,handleSubmit,formState:{errors},getValues} = useForm()
  const {idUsuario } = useParams()
  const navigate = useNavigate()
  const [perfil,setPerfil]:any = useState({})
  const [perfis,setPerfis]:any = useState([])

  async function obterUsuario() {
    await axios
      .get(`http://localhost:3333/api/usuarios/${idUsuario}`)
      .then((res) => {
        setUsuarios(res.data.data);
        if (res.data.success) {
          toast.success(res.data.message);
          reset(res.data.data)
        } else toast.warning("Nenhum usuário cadastrado/ativo no momento");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });

  }
  async function obterPerfil() {
    console.log('obtendo perfil');
    const idPerfil = getValues('perfis.id_perfil')
    console.log(idPerfil);
    await axios
      .get(`http://localhost:3333/api/perfis/${idPerfil}`)
      .then((res) => {
        console.log(res.data.data);
        if (res.data.success) {
          setPerfil(res.data.data);
          toast.success(res.data.message);
        } else toast.warning("Nenhum perfil encontrado");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }
  async function obterPerfis() {
    await axios
      .get(`http://localhost:3333/api/perfis`)
      .then((res) => {
        console.log(res.data.data);
        if (res.data.success) {
          console.log(res.data.data);
          setPerfis(res.data.data);
          toast.success(res.data.message);
        } else toast.warning("Nenhum perfil encontrado");
      })
      .catch((err) => {
        console.log(err.message)
        toast.error(err.response.data.message);
      });
  }

  async function criarUsuario(data) {
    // data['perfis']['id_perfil'] = Number(data['perfis']['id_perfil'])
    // data['id_perfil'] = data['perfis']['id_perfil']
    data['id_perfil'] = Number(data['id_perfil'])
    await axios
    .post(`http://localhost:3333/api/usuarios`,data)
    .then((res) => {
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/usuarios')
      }
    })
    .catch((err) => {
      console.log(err.response.data);
      toast.error(err.response.data.message);
    });
  }
  async function editarUsuario(data) {
    data['perfis']['id_perfil'] = Number(data['perfis']['id_perfil'])
    data['id_perfil'] = data['perfis']['id_perfil']
    await axios
      .put(`http://localhost:3333/api/usuarios/${idUsuario}`,data)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          navigate('/usuarios')
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        toast.error(err.response.data.message);
      });
  }

  useEffect(() => {
    if(idUsuario){
      obterUsuario();
    }
    obterPerfis()
  }, []);

  return (
    <div className="grid gap-12">
      <h1 className='text-4xl font-bold'>{idUsuario ? 'Editar Usuario' : 'Criar Usuario'}</h1>
      <div className="w-full max-h-[50rem] overflow-auto">
        <form onSubmit={idUsuario ? handleSubmit(editarUsuario) : handleSubmit(criarUsuario)}>
          <div className='grid grid-cols-2 gap-4'>
            {idUsuario && <div className='col-1'>
              <Input disabled={true} name={'id_usuario'} errors={errors} label={'ID Perfil'} placeholder={'Perfil do Usuário editado'} register={register} validators={{required:true}}/>
            </div>}
            <div className='col-1'>
              <Input name={'nome'} errors={errors} label={'nome'} placeholder={'Digite o nome do usuário'} register={register} validators={{required:true,maxLength:255}} maxLength={255}/>
            </div>
            {!idUsuario && <div className='col-1'>
              <Input name={'cpf'} errors={errors} type='text' mask='cpf' label={'cpf'} placeholder={'Digite apenas números'} register={register} validators={{required:true,maxLength:14}} maxLength={14}/>
            </div>}
            <div className='col-1'>
              <Input name={'telefone'} errors={errors} type='text' mask='telefone' label={'telefone'} placeholder={'Digite o telefone do usuário'} register={register} validators={{required:true,maxLength:14}} maxLength={14}/>
            </div>
            <div className='col-1'>
              <Input name={'email'} errors={errors} label={'email'} type='email' placeholder={'Digite o email do usuário'} register={register} validators={{required:true,maxLength:255}} maxLength={255}/>
            </div>
            <div className='col-1'>
              <Input name={'senha'} errors={errors} label={'senha'} type='password' placeholder={'Digite a senha do usuário'} register={register} validators={ !idUsuario && {required:true,maxLength:255}} maxLength={255}/>
            </div>
            <div className=''>
              <Input name={'confirmar_senha'} errors={errors}    type='password'     label={'Confirmar Senha'} placeholder={'Digite a senha novamente'} register={register} validators={ !idUsuario && {required:true,maxLength:255}} maxLength={255}/>
            </div>
            <div className=''>
              <Input chave='id_perfil' valor='descricao' options={perfis} name={'id_perfil'} errors={errors}   type='select'   label={'Perfil'} placeholder={'Selecione o Perfil'} register={register} validators={ !idUsuario && {required:true,maxLength:255}} maxLength={255}/>
            </div>
          </div>
          <div className='text-end'>
            <button type='submit' className='bg-azul text-white rounded-md px-8 py-2 text-2xl'> {idUsuario ? 'Editar' :'Criar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default UsuariosCreateOrUpdate