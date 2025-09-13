import axios from "axios";
import { PenBox, Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import SweetAlert from "../../components/SweetAlert";

const ReservasList = () => {
  const [loading, setLoading] = useState(false);
  const [reservas, setReservas]: any = useState([]);
  const [reservasFilter,setReservasFilter]:any = useState([])
  const [modalVisible,setModalVisible] = useState(false)
  const [reservaExclusao,setReservaExclusao]:any = useState({})

  function buscarReservas(data){
    console.log(data);
    if(data.length !== ''){
      console.log(data);
      setReservas(reservasFilter.filter(u => u.eventos.nome.toLowerCase().includes(data) || u.setores.nome.toLowerCase().includes(data) || u.status.toLowerCase().includes(data) ))
    }else setReservas(reservasFilter)

    console.log(reservasFilter);
  }


  async function obterReservas() {
    setModalVisible(true)
    await axios
    .get(`http://localhost:3333/api/reservas`)
    .then((res) => {
      setReservas(res.data.data);
      setReservasFilter(res.data.data)
      if (res.data.data.length > 0) {
        toast.success(res.data.message);
      } else toast.warning("Nenhum usuário cadastrado/ativo no momento");
    })
    .catch((err) => {
      toast.error(err.response.data.message);
    })
    .finally(() => {
      setModalVisible(false)
    });
  }
  

  console.log(reservasFilter);
  async function abrirModal(u) {
    setReservaExclusao(u)
    setModalVisible(true)
  }

  async function deletarReserva(){
  await axios
      .delete(`http://localhost:3333/api/reservas/${reservaExclusao.id_reserva}`)
      .then((res) => {
        if (res.data.success) {
          setReservas(reservas.filter((u) => u.id_reserva !== reservaExclusao.id_reserva));
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      }).finally(() => setModalVisible(false));
  }

  useEffect(() => {
    obterReservas();
  }, []);

  return (
    <>
    {modalVisible && <SweetAlert modalVisible={modalVisible}  isLoading={false} dados={reservaExclusao} action={deletarReserva} chave="id_reserva" valor="nome" title="Confirmar Exclusão" />}
    <div className="grid gap-12">
      <h1 className="text-3xl font-bold">Reservas</h1>
      <div className="flex items-center justify-end gap-4">
        <label htmlFor="pesquisa" className="text-2xl">
          Pesquisar
        </label>
        <input
          type="search"
          name="pesquisa"
          onChange={({target}) => buscarReservas(target.value)}
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
              <th>ID Reserva</th>
              <th>Cliente</th>
              <th>Evento</th>
              <th>Setor</th>
              <th>Usuário</th>
              <th>Status</th>
              <th className="text-center!">Ação</th>
            </tr>
          </thead>
          <tbody>
              {reservas && reservas.length > 0  ?  reservas.map(u => {
                return <tr key={u.id_reserva} className="border-b border-cinza *:py-4">
                    <td><p>{u.id_reserva}</p></td>
                    <td><p>{u.clientes.nome}</p></td>
                    <td><p>{u.eventos.nome}</p></td>
                    <td><p>{u.setores.nome}</p></td>
                    <td ><p>{u.usuarios.nome}</p></td>
                    <td ><p>{u.status}</p></td>
                    <td className="text-center!">
                      <div className="flex items-center justify-center gap-2">
                        <button className="bg-azul p-2 text-white rounded-md"><Link to={`editar/${u.id_reserva}`}><PenBox /></Link></button>
                        <button onClick={() => abrirModal(u)} className="bg-laranja p-2 text-white rounded-md cursor-pointer"><Trash /></button>
                        {/* <button className="bg-azul p-2 text-white rounded-md"><Link to={`reservas/${r.id_reserva}`}><PenBox /></Link></button> */}
                        {/* <button className="bg-azul p-2 text-white rounded-md"><Link to={`dashboard/${e.id_evento}`}><PenBox /></Link></button> */}
                      </div>
                    </td>
                </tr>
              }) : <tr><td colSpan={6}>Nenhum usuário encontrado</td></tr>}
            </tbody>
        </table>
      </div>
    </div>
              </>
  );
};

export default ReservasList;
