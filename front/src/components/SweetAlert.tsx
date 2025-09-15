import React, { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
const SweetAlert = ({
  modalVisible = false,
  title = "Aguarde...",
  body = "",
  dados,
  campos=[],
  chave = "",
  valor = "",
  isLoading = true,
  isError = false,
  action = () => {},
}) => {
  console.log(campos)
  useEffect(() => {
    {
      if (!modalVisible) return;
      modalVisible && isLoading
        ? MySwal.fire({
            title: <p>{title}</p>,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              // `MySwal` is a subclass of `Swal` with all the same instance & static methods
              MySwal.showLoading();
            },
          }).then(() => {
            console.log("FIM DO LOADING");
            action();
          })
        : isError
        ? MySwal.fire({
            title: <p>{title}</p>,
            html: `<div style="display: flex; flex-direction:column; justify-content: center; align-items: center;">${campos ? campos.map(c =>  `<p>${c}</p>`) : `<p>${body}</p>`}</br></div>`,
            icon: "error",
            showCancelButton: true,
            showConfirmButton:false,
            cancelButtonColor: "#1331a1",
            cancelButtonText: "Voltar",
            allowOutsideClick: false,
          }).then((e) => {
            
          })
        : MySwal.fire({
            title: <p>{title}</p>,
            html: `<div style="display: flex; justify-content: center; align-items: center;"><p style="">Deseja realmente excluir o usuário: </br><b>ID:</b> ${dados[chave]}</br><b>Nome:</b> ${dados[valor]}</p></div>`,
            icon: "question",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: "#f44528",
            confirmButtonText: "Excluir",
            cancelButtonColor: "#1331a1",
            cancelButtonText: "Cancelar",
            allowOutsideClick: false,
          }).then((e) => {
            if (e.isConfirmed) {
              action?.();
            }
          });
    }

    return () => {
      MySwal.close();
    };
  }, [modalVisible, title, dados, chave, valor, isLoading, action]);

  return null;
};
export default SweetAlert;
