import { NavigateFunction } from "react-router"
import { toast } from "react-toastify"

export const ValidarRota = (navigate:NavigateFunction,path:string) => {
    var usuario =JSON.parse(sessionStorage.getItem('user')!.toString()) 
    if(usuario){
      if(usuario.perfis.descricao === 'Validador' && path !== '/validador' ){
        navigate('/validador')
        toast.error('Não autorizado')
        return;
      }
    }else {
      navigate('/auth/login')
    }
}

