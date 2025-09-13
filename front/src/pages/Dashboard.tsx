import axios from 'axios'
import { BadgeDollarSignIcon, Ticket, TicketCheck, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import BarChartComponent from '../components/BarChartComponent'
import Status from '../components/Status'

const Dashboard = () => {

    const [cards,setCards]:any = useState([])
    const [dash,setDash]:any = useState([])
    const [setores,setSetores]:any = useState([])

    function defineStatusSetor(setor:any){
        const percent = ((setor.capacidade_atual)/setor.capacidade_max)*100

        if(percent <= 30){
            return 'Baixa'
        }else if(percent > 30 && percent <= 70){
            return 'Media'
        }else if(percent > 70 && percent <= 99){
            return 'Alta'
        }else return 'Lotado'


    }

    const {idEvento} = useParams()
    useEffect(() => {
        if(idEvento){
            obterDadosDash()
            obterEventosDoSetor()
        }
    },[])


    async function obterDadosDash() {
        await axios.get(`http://localhost:3333/api/dashboard/${idEvento}`)
        .then(res => {
            if(res.data.success){
                toast.success(res.data.message)
                setDash(res.data.data.dash)
                setCards(res.data.data.cards)
                console.log(res.data.data.cards);
            }
        })
    }

    async function obterEventosDoSetor() {
        await axios.get(`http://localhost:3333/api/setores/evento/${idEvento}`)
        .then(res => {
            if(res.data.success){
                toast.success(res.data.message)
                setSetores(res.data.data)
            }
        })
    }

  return (
    <div className="grid gap-12">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <h2 className="text-2xl font-semibold">{cards && cards.length > 0 ? cards[0].nome : 'Evento'}</h2>
      <div className="grid grid-cols-[25rem_1fr] h-[35rem] gap-4">
        <div className='grid gap-4 '>
            <div className='flex flex-col p-5 border-cinza border-1 rounded-md'>
                <h3 className='text-2xl font-semibold inline-flex items-center gap-4'><Users size={40} /> Capacidade Total</h3>
                {cards && cards.length > 0 && <span className='text-3xl font-bold mt-4'>{cards[0].capacidade}</span>}
            </div>
            <div className='flex flex-col p-5 border-cinza border-1 rounded-md'>
                <h3 className='text-2xl font-semibold inline-flex items-center gap-4'><Ticket size={40} /> Ingressos Disponíveis</h3>
                {cards && cards.length > 0 && <span className='text-3xl font-bold mt-4'>{cards[0].disponiveis}</span>}
            </div>
            <div className='flex flex-col p-5 border-cinza border-1 rounded-md'>
                <h3 className='text-2xl font-semibold inline-flex items-center gap-4'><BadgeDollarSignIcon size={40} /> Ingressos Vendidos</h3>
                {cards && cards.length > 0 && <span className='text-3xl font-bold mt-4'>{cards[0].vendidos}</span>}
            </div>
            <div className='flex flex-col p-5 border-cinza border-1 rounded-md'>
                <h3 className='text-2xl font-semibold inline-flex items-center gap-4'><TicketCheck size={40} /> Ingressos Validados</h3>
                {cards && cards.length > 0 && <span className='text-3xl font-bold mt-4'>{cards[0].validados}</span>}
            </div>
        </div>
        <div className='grid grid-rows-2 gap-4'>
            <div className='grid grid-cols-2 border-1 border-cinza rounded-md'>
                <div className='h-full p-5'>
                    {dash && dash.length > 0 && 
                        <BarChartComponent data={dash.map(d => {
                            return {
                                "nome": d.nome,
                                "vendidos":d.vendidos,
                                "disponiveis":d.disponiveis
                            }
                        })} keys={['vendidos','disponiveis']} title='Vendas por setor'  />
                    }
                </div>
                <div className='h-full p-4'>
                    {dash && dash.length > 0 && 
                        <BarChartComponent data={dash.map(d => {
                            return {
                                "nome": d.nome,
                                "ocupados":d.ocupados,
                                "desocupados":d.desocupados
                            }
                        })} keys={['ocupados','desocupados']} title='Ocupação por setor'  />
                    }
                </div>
            </div>
            <div className="w-full h-full max-h-[17.5rem] rounded-md border-cinza border-1 overflow-auto">
            <table className="w-full text-left">
                <caption className='text-start px-4 py-1 text-2xl font-semibold mb-3'>Lotação dos Setores</caption>
          <colgroup>
            <col width={"10%"} />
            <col width={"20%"} />
            <col width={"10%"} />
            <col width={"10%"} />
            <col width={"10%"} />
            <col width={"20%"} />
          </colgroup>
          <thead>
            <tr className='*:py-2 *:px-4'>
              <th>ID Setor</th>
              <th>Nome</th>
              <th className='text-center!' >Cap. Atual</th>
              <th className='text-center!' >Cap. Máx</th>
              <th className="text-center!">% Lotação</th>
              <th className="text-center!">Status</th>
            </tr>
          </thead>
          <tbody>
              {setores && setores.length > 0  ?  setores.map(u => {
                return <tr key={u.id_setor} className="border-b border-cinza *:py-6 *:px-4">
                    <td><p>{u.id_setor}</p></td>
                    <td><p>{u.nome}</p></td>
                    <td className='text-center!'><p>{u.capacidade_atual}</p></td>
                    <td className='text-center!'><p>{u.capacidade_max}</p></td>
                    <td className='text-center!'><p>{(((u.capacidade_atual)/u.capacidade_max)*100).toFixed(2)}</p></td>
                    <td className='text-center! w-20'><p><Status  tableCard value={defineStatusSetor(u)} /></p></td>
                    
                </tr>
              }) : <tr><td colSpan={6}>Nenhum usuário encontrado</td></tr>}
            </tbody>
        </table>
      </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard