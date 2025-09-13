import axios from "axios";
import { PenBox, PieChart, Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";

const SetoresList = () => {
  const [loading, setLoading] = useState(false);
  const [setores, setSetores]: any = useState([]);
  const [eventos,setEventos]: any = useState([]);
  const [setorsFilter,setSetoresFilter]:any = useState([])

  function buscarSetores(data){
    console.log(data);
    if(data.length !== ''){
      data = data.toLowerCase()
      setSetores(setorsFilter.filter(u => u.id_setor === Number(data) || u.nome.toLowerCase().includes(data) || u.eventos.nome.toLowerCase().includes(data)))
    }else setSetores(setorsFilter)

    console.log(setorsFilter);
  }


  async function obterEventos() {
    await axios
      .get(`http://localhost:3333/api/eventos`)
      .then((res) => {
        setEventos(res.data.data);
        if (res.data.data.length > 0) {
          toast.success(res.data.message);
        } else toast.warning("Nenhum Evento cadastrado/ativo no momento");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }



  async function obterSetores() {
    await axios
      .get(`http://localhost:3333/api/setores`)
      .then((res) => {
        setSetores(res.data.data);
        setSetoresFilter(res.data.data)
        if (res.data.data.length > 0) {
          toast.success(res.data.message);
        } else toast.warning("Nenhum usuário cadastrado/ativo no momento");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }


  console.log(setorsFilter);
  async function deletarSetor(idSetor) {
    await axios
      .delete(`http://localhost:3333/api/setores/${idSetor}`)
      .then((res) => {
        if (res.data.success) {
          setSetores(setores.filter((u) => u.id_setor !== idSetor));
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }

  useEffect(() => {
    obterSetores();
  }, []);

  return (
    <div className="grid gap-12">
      <h1 className="text-3xl font-bold">Setores</h1>
      <div className="flex items-center justify-end gap-4">
        <label htmlFor="pesquisa" className="text-2xl">
          Pesquisar
        </label>
        <input
          type="search"
          name="pesquisa"
          onChange={({target}) => buscarSetores(target.value)}
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
            <col width={"20%"} />
            <col width={"20%"} />
            <col width={"10%"} />
            <col width={"10%"} />
            <col width={"10%"} />
          </colgroup>
          <thead>
            <tr>
              <th>ID Setor</th>
              <th>Nome</th>
              <th>Evento</th>
              <th className='text-center!' >Capacidade Atual</th>
              <th className='text-center!' >Capacidade Máxima</th>
              <th className="text-center!">Ação</th>
            </tr>
          </thead>
          <tbody>
              {setores && setores.length > 0  ?  setores.map(u => {
                return <tr key={u.id_setor} className="border-b border-cinza *:py-4">
                    <td><p>{u.id_setor}</p></td>
                    <td><p>{u.nome}</p></td>
                    <td><p>{u.eventos.nome}</p></td>
                    <td className='text-center!'><p>{u.capacidade_atual}</p></td>
                    <td className='text-center!'><p>{u.capacidade_max}</p></td>
                    <td className="text-center!">
                      <div className="flex items-center justify-center gap-2">
                        <button className="bg-azul p-2 text-white rounded-md"><Link to={`editar/${u.id_setor}`}><PenBox /></Link></button>
                        <button onClick={() => deletarSetor(u.id_setor)} className="bg-laranja p-2 text-white rounded-md cursor-pointer"><Trash /></button>
                        {/* <button className="bg-azul p-2 text-white rounded-md"><Link to={`reservas/${r.id_reserva}`}><PenBox /></Link></button> */}
                        <button className="bg-verde p-2 text-white rounded-md"><Link to={`dashboard/${u.id_setor}`}><PieChart /></Link></button>
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

export default SetoresList;
