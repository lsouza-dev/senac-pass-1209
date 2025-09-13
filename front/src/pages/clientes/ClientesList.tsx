import axios from "axios";
import { PenBox, Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import SweetAlert from "../../components/SweetAlert";

const ClientesList = () => {
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes]: any = useState([]);
  const [clientesFilter,setClientesFilter]:any = useState([])
  const [modalVisible,setModalVisible] = useState(false)
  const [clienteExclusao,setClienteExclusao]:any = useState({})

  function buscarClientes(data){
    console.log(data);
    if(data.length !== ''){
      console.log(data);
      setClientes(clientesFilter.filter(u => u.nome.toLowerCase().includes(data) || u.cpf.toLowerCase().includes(data) || u.email.toLowerCase().includes(data) || u.telefone.toLowerCase().includes(data)))
    }else setClientes(clientesFilter)

    console.log(clientesFilter);
  }


  async function obterClientes() {
    setModalVisible(true)
    await axios
    .get(`http://localhost:3333/api/clientes`)
    .then((res) => {
      setClientes(res.data.data);
      setClientesFilter(res.data.data)
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
  

  console.log(clientesFilter);
  async function abrirModal(u) {
    setClienteExclusao(u)
    setModalVisible(true)
  }

  async function deletarCliente(){
  await axios
      .delete(`http://localhost:3333/api/clientes/${clienteExclusao.id_cliente}`)
      .then((res) => {
        if (res.data.success) {
          setClientes(clientes.filter((u) => u.id_cliente !== clienteExclusao.id_cliente));
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      }).finally(() => setModalVisible(false));
  }

  useEffect(() => {
    obterClientes();
  }, []);

  return (
    <>
    {modalVisible && <SweetAlert modalVisible={modalVisible}  isLoading={false} dados={clienteExclusao} action={deletarCliente} chave="id_cliente" valor="nome" title="Confirmar Exclusão" />}
    <div className="grid gap-12">
      <h1 className="text-3xl font-bold">Clientes</h1>
      <div className="flex items-center justify-end gap-4">
        <label htmlFor="pesquisa" className="text-2xl">
          Pesquisar
        </label>
        <input
          type="search"
          name="pesquisa"
          onChange={({target}) => buscarClientes(target.value)}
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
          </colgroup>
          <thead>
            <tr>
              <th>ID Usuário</th>
              <th>Nome</th>
              <th>Cpf</th>
              <th>Email</th>
              <th>telefone</th>
              <th className="text-center!">Ação</th>
            </tr>
          </thead>
          <tbody>
              {clientes && clientes.length > 0  ?  clientes.map(u => {
                return <tr key={u.id_cliente} className="border-b border-cinza *:py-4">
                    <td><p>{u.id_cliente}</p></td>
                    <td><p>{u.nome}</p></td>
                    <td><p>{u.cpf}</p></td>
                    <td><p>{u.email}</p></td>
                    <td ><p>{u.telefone}</p></td>
                    <td className="text-center!">
                      <div className="flex items-center justify-center gap-2">
                        <button className="bg-azul p-2 text-white rounded-md"><Link to={`editar/${u.id_cliente}`}><PenBox /></Link></button>
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

export default ClientesList;
