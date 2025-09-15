import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../../components/Input";
import axios from "axios";
import { toast } from "react-toastify";
import Ingresso from "../../components/Ingresso";
import { Download } from "lucide-react";
import { ValidarRota } from "../../ValidarRota";

const Validador = () => {

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
  } = useForm();
  const [validado, setValidado] = useState(false);
  const [printing,setPrinting] = useState(false)
  const [id_reserva,setId_reserva] = useState('')
  const [reserva,setReserva] = useState({})

  const handleValidate = async (data) => {
    setId_reserva(getValues('id_reserva'))
    await axios
    .put(`http://localhost:3333/api/reservas/${id_reserva}/validar`)
    .then((res) => {
      if (res.data.success) {
        toast.success(res.data.message);
          setValidado(true)
        }
      })
      .catch((err) => {
        console.log(err.response);
        toast.error(err.response.data.message);
        if(err.response.data.message.includes('validada'))
          setValidado(true)
      });
    };
    const baixarIngresso = async () => {
      setId_reserva(getValues('id_reserva'))
      console.log(id_reserva)
      await axios
      .get(`http://localhost:3333/api/reservas/${id_reserva}`)
      .then((res) => {
        if (res.data.success) {
          setReserva(res.data.data)
          setValidado(true)
          setPrinting(true)
        }
      })
      .catch((err) => {
        console.log(err.response);
        toast.error(err.response.data.message);
        if(err.response.data.message.includes('validada'))
          setValidado(true)
      });
  };

  function novaValidacao(){
    setValidado(false)
    setValue('id_reserva','')
  }

  return (
    <>
      {!printing && <div className="grid gap-4">
        <h1 className="text-center text-2xl font-bold">Validador</h1>
        <form onSubmit={validado ? handleSubmit(novaValidacao) : handleSubmit(handleValidate)} className="flex flex-col gap-4">
          <div>
            <Input
              style={{ borderColor: "black" }}
              name={"id_reserva"}
              label={"Código"}
              placeholder="Digite o código do ingresso"
              maxLength={255}
              register={register}
              validators={{ required: true, maxLength: 255 }}
              errors={errors}
            />
          </div>
          <div className={`flex *:w-full items-center justify-center ${validado ? 'flex-col' : ''}`}>
            <button
              type="submit"
              className="inline-flex items-center mt-4 gap-2 justify-center cursor-pointer text-xl font-bold text-white bg-azul px-8 py-2 rounded-md"
            >
              {validado ? "Nova Validação" : "Validar"}
            </button>
            {validado && <button
              type="button"
              onClick={() => baixarIngresso()}
              className="inline-flex items-center mt-4 gap-2 justify-center cursor-pointer text-xl font-bold text-white bg-azul px-8 py-2 rounded-md"
            >
              {'Download'} <Download />
            </button>}
          </div>
        </form>
      </div>}

      {printing && <Ingresso printing={printing} data={reserva} onFinish={() => {setPrinting(false)}} />}
    </>
  );
};

export default Validador;
