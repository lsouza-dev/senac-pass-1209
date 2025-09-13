import axios from "axios";
import { PenBox, Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import SweetAlert from "../../components/SweetAlert";

const UsuariosList = () => {
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios]: any = useState([]);
  const [usuariosFilter,setUsuariosFilter]:any = useState([])
  const [modalVisible,setModalVisible] = useState(false)
  const [usuarioExclusao,setUsuarioExclusao]:any = useState({})

  function buscarUsuarios(data){
    console.log(data);
    if(data.length !== ''){
      console.log(data);
      setUsuarios(usuariosFilter.filter(u => u.nome.toLowerCase().includes(data) || u.cpf.toLowerCase().includes(data) || u.perfis.descricao.toLowerCase().includes(data)))
    }else setUsuarios(usuariosFilter)

    console.log(usuariosFilter);
  }


  async function obterUsuarios() {
    setModalVisible(true)
    await axios
    .get(`http://localhost:3333/api/usuarios`)
    .then((res) => {
      setUsuarios(res.data.data);
      setUsuariosFilter(res.data.data)
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
  

  console.log(usuariosFilter);
  async function abrirModal(u) {
    setUsuarioExclusao(u)
    setModalVisible(true)
  }

  async function deletarUsuario(){
  await axios
      .delete(`http://localhost:3333/api/usuarios/${usuarioExclusao.id_usuario}`)
      .then((res) => {
        if (res.data.success) {
          setUsuarios(usuarios.filter((u) => u.id_usuario !== usuarioExclusao.id_usuario));
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      }).finally(() => setModalVisible(false));
  }

  useEffect(() => {
    obterUsuarios();
  }, []);

  return (
    <>
    {modalVisible && <SweetAlert modalVisible={modalVisible}  isLoading={false} dados={usuarioExclusao} action={deletarUsuario} chave="id_usuario" valor="nome" title="Confirmar Exclusão" />}
    <div className="grid gap-12">
      <h1 className="text-3xl font-bold">Usuarios</h1>
      <div className="flex items-center justify-end gap-4">
        <label htmlFor="pesquisa" className="text-2xl">
          Pesquisar
        </label>
        <input
          type="search"
          name="pesquisa"
          onChange={({target}) => buscarUsuarios(target.value)}
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
              <th>ID Usuário</th>
              <th>Nome</th>
              <th>Cpf</th>
              <th>Email</th>
              <th className="text-center!">Perfil</th>
              <th className="text-center!">Status</th>
              <th className="text-center!">Ação</th>
            </tr>
          </thead>
          <tbody>
              {usuarios && usuarios.length > 0  ?  usuarios.map(u => {
                return <tr key={u.id_usuario} className="border-b border-cinza *:py-4">
                    <td><p>{u.id_usuario}</p></td>
                    <td><p>{u.nome}</p></td>
                    <td><p>{u.cpf}</p></td>
                    <td><p>{u.email}</p></td>
                    <td className="text-center!"><p>{u.perfis.descricao}</p></td>
                    <td className="text-center!"><p>{u.ativo ? 'Ativo' : 'Inativo'}</p></td>
                    <td className="text-center!">
                      <div className="flex items-center justify-center gap-2">
                        <button className="bg-azul p-2 text-white rounded-md"><Link to={`editar/${u.id_usuario}`}><PenBox /></Link></button>
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

export default UsuariosList;
