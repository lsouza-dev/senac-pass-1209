import axios from "axios";
import { Download, Link, PenBox, Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import Input from "../../components/Input";
import DateTimeInput from "../../components/DateTimeInput";
import Status from "../../components/Status";
import Ingresso from "../../components/Ingresso";

const ReservasCreateOrUpdate = () => {
  const [loading, setLoading] = useState(false);

  const [reservas, setReservas]: any = useState([]);
  const [clientes, setClientes]: any = useState([]);
  const [eventos, setEventos]: any = useState([]);
  const [setores, setSetores]: any = useState([]);
  const [printing,setPrinting] = useState(false)

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const { idReserva } = useParams();
  const navigate = useNavigate();

  function formatarReserva(reserva) {
    let dt_criacao = reserva.dt_criacao.split("T");
    dt_criacao[1] = dt_criacao[1].split(":");
    dt_criacao[1].splice(2, 1);
    const h_criacao = dt_criacao[1].join(":");

    if (reserva["dt_validacao"]) {
      let dt_validacao = reserva.dt_validacao.split("T");
      dt_validacao[1] = dt_validacao[1].split(":");
      dt_validacao[1].splice(2, 1);
      const h_validacao = dt_validacao[1].join(":");

      reserva["dt_validacao"] = `${dt_validacao[0]}`;
      reserva["h_validacao"] = h_validacao;
    }

    reserva["dt_criacao"] = `${dt_criacao[0]}`;
    reserva["h_criacao"] = h_criacao;
    console.log(reserva);
    return reserva;
  }

  async function obterReserva() {
    await axios
      .get(`http://localhost:3333/api/reservas/${idReserva}`)
      .then((res) => {
        setReservas(res.data.data);
        if (res.data.success) {
          toast.success(res.data.message);
          console.log(res.data.data);
          const reserva = formatarReserva(res.data.data);
          reset(reserva);
        } else toast.warning("Nenhum usuário cadastrado/ativo no momento");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }
  async function obterClientes() {
    await axios
      .get(`http://localhost:3333/api/clientes`)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          setClientes(res.data.data);
        } else toast.warning("Nenhum usuário cadastrado/ativo no momento");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }
  async function obterEventos() {
    await axios
      .get(`http://localhost:3333/api/eventos`)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          setEventos(res.data.data);
        } else toast.warning("Nenhum usuário cadastrado/ativo no momento");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }
  async function obterSetores() {
    await axios
      .get(`http://localhost:3333/api/setores`)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          setSetores(res.data.data);
        } else toast.warning("Nenhum usuário cadastrado/ativo no momento");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }

  async function criarReserva(data) {
    data["id_evento"] = Number(data["id_evento"]);
    data["id_setor"] = Number(data["id_setor"]);
    data["id_cliente"] = Number(data["id_cliente"]);
    const user = JSON.parse(
      window.sessionStorage.getItem("user")!.toString() ?? {}
    );
    data["id_usuario"] = Number(user.id_usuario);
    await axios
      .post(`http://localhost:3333/api/reservas`, data)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/reservas");
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        toast.error(err.response.data.message);
      });
  }
  async function editarReserva(data) {
    data["id_setor"] = Number(data["id_setor"]);
    await axios
      .put(`http://localhost:3333/api/reservas/${idReserva}`, data)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/reservas");
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        toast.error(err.response.data.message);
      });
  }
  async function validarReserva(event) {
    event.preventDefault();

    if (reservas.status === "Emitido") {
      await axios
        .put(`http://localhost:3333/api/reservas/${idReserva}/validar`)
        .then((res) => {
          if (res.data.success) {
            toast.success(res.data.message);
            navigate("/reservas");
          }
        })
        .catch((err) => {
          console.log(err.response.data);
          toast.error(err.response.data.message);
        });
    } else {
      navigate("/reservas");
    }
  }


  function baixarIngresso(){
    setPrinting(true)
  }

  useEffect(() => {
    if (idReserva) {
      obterReserva();
    }
    obterClientes();
    obterEventos();
    obterSetores();
  }, []);

  return (<>
    <div className="grid gap-6 print:hidden">
      <h1 className="text-4xl font-bold">
        {idReserva ? "Editar Reserva" : "Criar Reserva"}
      </h1>
      {reservas.status === "Validado" && (
        <div className="text-end">
          <button
            type="button"
            onClick={() => baixarIngresso()}
            className="bg-azul inline-flex items-center justify-center gap-4 text-white rounded-md px-8 py-2 text-2xl"
          >
            
            {'Baixar'}
            <Download />
          </button>
        </div>
      )}
      <div className="w-full max-h-[50rem] overflow-auto">
        <form
          onSubmit={
            idReserva ? handleSubmit(editarReserva) : handleSubmit(criarReserva)
          }
        >
          <div className="grid grid-cols-2 gap-4">
            {idReserva && (
              <div className="col-1">
                <Input
                  disabled={true}
                  name={"id_reserva"}
                  errors={errors}
                  label={"ID Reserva"}
                  placeholder={"ID do Reserva editada"}
                  register={register}
                  validators={{ required: true }}
                />
              </div>
            )}
            <div className="col-1">
              <Input
                name={"id_cliente"}
                type="select"
                disabled={
                  idReserva !== undefined || reservas.status === "Validado"
                }
                chave="id_cliente"
                valor="nome"
                options={clientes}
                errors={errors}
                label={"clientes"}
                register={register}
                validators={{ required: true, maxLength: 255 }}
                maxLength={255}
              />
            </div>
            <div className="col-1">
              <Input
                name={"id_evento"}
                type="select"
                disabled={
                  idReserva !== undefined || reservas.status === "Validado"
                }
                chave="id_evento"
                valor="nome"
                options={eventos}
                errors={errors}
                label={"eventos"}
                register={register}
                validators={{ required: true, maxLength: 255 }}
                maxLength={255}
              />
            </div>
            <div className={`${idReserva ? "col-2" : "col-1"}`}>
              <Input
                name={"id_setor"}
                type="select"
                chave="id_setor"
                disabled={reservas.status === "Validado"}
                valor="nome"
                options={setores}
                errors={errors}
                label={"setores"}
                register={register}
                validators={{ required: true, maxLength: 255 }}
                maxLength={255}
              />
            </div>
            {idReserva && (
              <>
                <div className=" col-1">
                  <DateTimeInput
                    name1={"dt_criacao"}
                    disabled={
                      idReserva !== undefined || reservas.status === "Validado"
                    }
                    name2={"h_criacao"}
                    label={["Data de Criação", "Hora de Criação"]}
                    placeholder={["dd/MM/yyyy", "00:00"]}
                    register={register}
                  />
                </div>
                <div className=" col-2">
                  <DateTimeInput
                    name1={"dt_validacao"}
                    disabled={
                      idReserva !== undefined || reservas.status === "Validado"
                    }
                    name2={"h_validacao"}
                    label={["Data de Validação", "Hora de Validação"]}
                    placeholder={["dd/MM/yyyy", "00:00"]}
                    register={register}
                  />
                </div>
                <div className="col-1">
                  <Status value={reservas.status} />
                </div>
              </>
            )}
          </div>
          <div className="flex gap-4 items-center justify-end">
            <button
              type="button"
              onClick={() => validarReserva(event)}
              className="bg-white text-azul border-azul border-1 rounded-md px-8 py-2 text-2xl"
            >
              {" "}
              {reservas.status === "Emitido" ? "Validar" : "Voltar"}
            </button>
            <button
              type="submit"
              disabled={reservas.status === "Validado"}
              className="bg-azul text-white disabled:bg-cinza rounded-md px-8 py-2 text-2xl"
            >
              {" "}
              {idReserva ? "Editar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>

    {printing && <Ingresso printing={printing} data={reservas} onFinish={() => {setPrinting(false)}} />}
  </>
  );
};

export default ReservasCreateOrUpdate;
