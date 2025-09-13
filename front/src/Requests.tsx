import axios from "axios";
import { toast } from "react-toastify";

async function obterUsuario(idUsuario:number) {
    await axios
      .get(`http://localhost:3333/api/usuarios/${idUsuario}`)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          return res.data.data
        } else toast.warning("Nenhum usuário cadastrado/ativo no momento");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }