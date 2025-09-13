import axios from "axios";
import { PenBox, PieChart, Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { formatarEvento } from "./EventosCreateOrUpdate";

const EventosList = () => {
  const [loading, setLoading] = useState(false);
  const [eventos, setEventos]: any = useState([]);
  const [eventosFilter,setEventosFilter]:any = useState([])

  function buscarEventos(data){
    console.log(data);
    if(data.length !== ''){
      data = data.toLowerCase()
      setEventos(eventosFilter.filter(u => u.id_evento === Number(data) || u.nome.toLowerCase().includes(data) || u.local.toLowerCase().includes(data) || u.dt_inicio.toLowerCase().includes(data)))
    }else setEventos(eventosFilter)

    console.log(eventosFilter);
  }


  async function obterEventos() {
    await axios
      .get(`http://localhost:3333/api/eventos`)
      .then((res) => {
        setEventos(res.data.data);
        setEventosFilter(res.data.data)
        if (res.data.data.length > 0) {
          toast.success(res.data.message);
        } else toast.warning("Nenhum usuário cadastrado/ativo no momento");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }


  console.log(eventosFilter);
  async function deletarEvento(idEvento) {
    await axios
      .delete(`http://localhost:3333/api/eventos/${idEvento}`)
      .then((res) => {
        if (res.data.success) {
          setEventos(eventos.filter((u) => u.id_evento !== idEvento));
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }

  useEffect(() => {
    obterEventos();
  }, []);

  return (
    <div className="grid gap-12">
      <h1 className="text-3xl font-bold">Eventos</h1>
      <div className="flex items-center justify-end gap-4">
        <label htmlFor="pesquisa" className="text-2xl">
          Pesquisar
        </label>
        <input
          type="search"
          name="pesquisa"
          onChange={({target}) => buscarEventos(target.value)}
          className="p-2 w-1/4 rounded-md border"
          placeholder="Digite o que deseja pesquisar"
        />
      </div>
      <div className="flex items-center justify-end">
        <Link to={"criar"}>
          <button className="inline-flex items-center gap-2 justify-center cursor-pointer text-xl font-bold text-white bg-azul px-8 py-2 rounded-md">
            <Plus />
            Criar
          </button>
        </Link>
      </div>
      <div className="w-full max-h-[40rem] overflow-auto">
        <table className="w-full text-left">
          <colgroup>
            <col width={"10%"} />
            <col width={"10%"} />
            <col width={"10%"} />
            <col width={"10%"} />
            <col width={"10%"} />
            <col width={"10%"} />
            <col width={"10%"} />
          </colgroup>
          <thead>
            <tr>
              <th>ID Evento</th>
              <th>Nome</th>
              <th>Local</th>
              <th>Data Inicio</th>
              <th>Data Fim</th>
              <th>Capacidade Máx.</th>
              <th className="text-center!">Ação</th>
            </tr>
          </thead>
          <tbody>
              {eventos && eventos.length > 0  ?  eventos.map(u => {
                formatarEvento(u)
                return <tr key={u.id_evento} className="border-b border-cinza *:py-4">
                    <td><p>{u.id_evento}</p></td>
                    <td><p>{u.nome}</p></td>
                    <td><p>{u.local}</p></td>
                    <td><p>{u.dt_inicio}</p></td>
                    <td><p>{u.dt_fim}</p></td>
                    <td><p>{u.capacidade_max}</p></td>
                    <td className="text-center!">
                      <div className="flex items-center justify-center gap-2">
                        <button className="bg-azul p-2 text-white rounded-md"><Link to={`editar/${u.id_evento}`}><PenBox /></Link></button>
                        <button onClick={() => deletarEvento(u.id_evento)} className="bg-laranja p-2 text-white rounded-md cursor-pointer"><Trash /></button>
                        {/* <button className="bg-azul p-2 text-white rounded-md"><Link to={`reservas/${r.id_reserva}`}><PenBox /></Link></button> */}
                        <button className="bg-verde p-2 text-white rounded-md"><Link to={`/dashboard/${u.id_evento}`}><PieChart /></Link></button>
                      </div>
                    </td>
                </tr>
              }) : <tr><td colSpan={6}>Nenhum usuário encontrado</td></tr>}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventosList;
