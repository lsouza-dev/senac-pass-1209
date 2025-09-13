import axios from 'axios';
import { Link, PenBox, Plus, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import Input from '../../components/Input';


const SetoresCreateOrUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [setores, setSetores]: any = useState([]);
  const [eventos, setEventos]: any = useState([]);
  const {register,reset,handleSubmit,formState:{errors},getValues} = useForm()
  
  const {idSetor } = useParams()
  const navigate = useNavigate()

  async function obterSetor() {
    await axios
      .get(`http://localhost:3333/api/setores/${idSetor}`)
      .then(async (res) => {
        if (res.data.success) {
          setSetores(res.data.data);
          toast.success(res.data.message);
          reset(res.data.data)

        } else toast.warning("Nenhum usuário cadastrado/ativo no momento");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }
  
  async function obterEventos() {
    await axios
      .get(`http://localhost:3333/api/eventos`)
      .then(async (res) => {
        if (res.data.success) {
          setEventos(res.data.data);
          toast.success(res.data.message);
        } else toast.warning("Nenhum usuário cadastrado/ativo no momento");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }


  
  
  async function criarSetor(data) {
    console.log(data);
    data['capacidade_max'] = Number(data['capacidade_max'])
    data['id_evento'] = Number(data['id_evento'])
    await axios
    .post(`http://localhost:3333/api/setores`,data)
    .then((res) => {
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/setores')
      }
    })
    .catch((err) => {
      console.log(err.response.data);
      toast.error(err.response.data.message);
    });
  }


  async function editarSetor(data) {
    console.log(data);
    data['capacidade_max'] = Number(data['capacidade_max'])
    data['id_evento'] = Number(data['id_evento'])
    await axios
      .put(`http://localhost:3333/api/setores/${idSetor}`,data)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          navigate('/setores')
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        toast.error(err.response.data.message);
      });
  }

  useEffect(() => {
    if(idSetor){
      obterSetor();
    }
    obterEventos()
  }, []);


  console.log(errors);

  return (
    <div className="grid gap-12">
      <h1 className='text-4xl font-bold'>{idSetor ? 'Editar Setor' : 'Criar Setor'}</h1>
      <div className="w-full max-h-[50rem] overflow-auto">
        <form onSubmit={idSetor ? handleSubmit(editarSetor) : handleSubmit(criarSetor)}>
          <div className='grid grid-cols-2 gap-4'>
            {idSetor && <div className='col-1'>
              <Input disabled={true} name={'id_setor'} errors={errors} label={'ID Setor'} placeholder={'ID do Setor editado'} register={register} validators={{required:true}}/>
            </div>}
            <div className='col-1'>
              <Input name={'nome'} type='text' errors={errors} label={'nome'} placeholder={'Digite o nome do usuário'} register={register} validators={{required:true,maxLength:255}} maxLength={255}/>
            </div>
            <div className='col-1'> 
              <Input name={'capacidade_max'} type='number' errors={errors} label={'Capacidade Máxima'} placeholder={'Digite apenas números'} register={register} validators={{required:true}}/>
            </div>
            <div className='col-1'> 
              <Input name={'id_evento'} type='select' options={eventos} chave='id_evento' valor='nome' errors={errors} label={'Evento'} placeholder={'Digite apenas números'} register={register} validators={{required:true}}/>
            </div>
            <div className='col-span-2'>
              <Input name={'descricao'} type='textarea' mask='' errors={errors} label={'descricao'} placeholder={'Digite a descricao do setor'} register={register} validators={{required:true,maxLength:255}} maxLength={255}/>
            </div>
          </div>
          <div className='text-end mt-4'>
            <button type='submit' className='bg-azul text-white rounded-md px-8 py-2 text-2xl'> {idSetor ? 'Editar' :'Criar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default SetoresCreateOrUpdate