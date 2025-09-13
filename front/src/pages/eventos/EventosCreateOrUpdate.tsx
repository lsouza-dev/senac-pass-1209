import axios from 'axios';
import { Link, PenBox, Plus, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import Input from '../../components/Input';
import DateTimeInput from '../../components/DateTimeInput';

export function formatarEvento(evento){
    
    let dt_inicio = evento.dt_inicio.split('T')
    dt_inicio[1] = dt_inicio[1].split(':')
    dt_inicio[1].splice(2,1)
    const h_inicio = dt_inicio[1].join(':')
    
    let dt_fim = evento.dt_fim.split('T')
    dt_fim[1] = dt_fim[1].split(':')
    dt_fim[1].splice(2,1)
    const h_fim = dt_fim[1].join(':')
    
  
    
    
    evento['dt_inicio'] = `${dt_inicio[0]}`
    evento['h_inicio'] = h_inicio
    evento['dt_fim'] = `${dt_fim[0]}`
    evento['h_fim'] = h_fim
    console.log(evento);
    return evento
  }

const EventosCreateOrUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [eventos, setEventos]: any = useState([]);
  const {register,reset,handleSubmit,formState:{errors},getValues} = useForm()
  const {idEvento } = useParams()
  const navigate = useNavigate()
  const [perfil,setPerfil]:any = useState({})
  const [perfis,setPerfis]:any = useState([])

  async function obterEvento() {
    await axios
      .get(`http://localhost:3333/api/eventos/${idEvento}`)
      .then(async (res) => {
        if (res.data.success) {
          setEventos(res.data.data);
          toast.success(res.data.message);
          formatarEvento(res.data.data)
          reset(res.data.data)

        } else toast.warning("Nenhum usuário cadastrado/ativo no momento");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
      
      
  }


  
  
  async function criarEvento(data) {
    console.log(data);
    data['dt_inicio'] = `${data['dt_inicio']} ${data['h_inicio']}`
    data['dt_fim'] = `${data['dt_fim']} ${data['h_fim']}`
    data['capacidade_max'] = Number(data['capacidade_max'])
    await axios
    .post(`http://localhost:3333/api/eventos`,data)
    .then((res) => {
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/eventos')
      }
    })
    .catch((err) => {
      console.log(err.response.data);
      toast.error(err.response.data.message);
    });
  }


  async function editarEvento(data) {
    data['dt_inicio'] = `${data['dt_inicio']} ${data['h_inicio']}`
    data['dt_fim'] = `${data['dt_fim']} ${data['h_fim']}`
    data['capacidade_max'] = Number(data['capacidade_max'])
    await axios
      .put(`http://localhost:3333/api/eventos/${idEvento}`,data)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          navigate('/eventos')
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        toast.error(err.response.data.message);
      });
  }

  useEffect(() => {
    if(idEvento){
      obterEvento();
    }
  }, []);

  return (
    <div className="grid gap-12">
      <h1 className='text-4xl font-bold'>{idEvento ? 'Editar Evento' : 'Criar Evento'}</h1>
      <div className="w-full max-h-[50rem] overflow-auto">
        <form onSubmit={idEvento ? handleSubmit(editarEvento) : handleSubmit(criarEvento)}>
          <div className='grid grid-cols-2 gap-4'>
            {idEvento && <div className='col-1'>
              <Input disabled={true} name={'id_evento'} errors={errors} label={'ID Evento'} placeholder={'ID do Evento editado'} register={register} validators={{required:true}}/>
            </div>}
            <div className='col-1'>
              <Input name={'nome'} errors={errors} label={'nome'} placeholder={'Digite o nome do usuário'} register={register} validators={{required:true,maxLength:255}} maxLength={255}/>
            </div>
            <div className='col-1'> 
              <Input name={'local'} errors={errors} label={'local'} placeholder={'Digite o local do evento'} register={register} validators={{required:true,maxLength:255}} maxLength={255}/>
            </div>
            <div className='col-1'> 
              <Input name={'capacidade_max'} type='number' errors={errors} label={'Capacidade Máxima'} placeholder={'Digite apenas números'} register={register} validators={{required:true}}/>
            </div>
            <div className=' col-1'>
              <DateTimeInput name1={'dt_inicio'} name2={'h_inicio'} label={['Data de Início','Hora de Início']} placeholder={['dd/MM/yyyy','00:00']} validators={{required:true}} errors={errors} register={register}/>
            </div>
            <div className=' col-2'>
              <DateTimeInput name1={'dt_fim'} name2={'h_fim'} label={['Data Final','Hora Final']} placeholder={['dd/MM/yyyy','00:00']} validators={{required:true}} errors={errors} register={register}/>
            </div>
            <div className='col-span-2'>
              <Input name={'descricao'} type='textarea' mask='' errors={errors} label={'descricao'} placeholder={'Digite a descricao do evento'} register={register} validators={{required:true,maxLength:255}} maxLength={255}/>
            </div>
          </div>
          <div className='text-end mt-4'>
            <button type='submit' className='bg-azul text-white rounded-md px-8 py-2 text-2xl'> {idEvento ? 'Editar' :'Criar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default EventosCreateOrUpdate