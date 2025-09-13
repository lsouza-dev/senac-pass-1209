import { FastifyReply } from "fastify";
import { PrismaClient } from "./generated/prisma/index";
import { usuarioFields } from "./schemas/UsuariosSchema";
import { eventoFields } from "./schemas/EventoSchema";
import { setorFields } from "./schemas/SetorSchema";
import { reservaFields } from "./schemas/ReservaSchema";
import { clienteFields } from "./schemas/ClienteSchema";

export const prisma = new PrismaClient()

export function mensagemPadrao(success:boolean,message:string,data:any = null,campos:any = null){
  return data ? {
    "success":success,
    "message": message,
    "data":data
  } : campos ? {
    "success":success,
    "message": message,
    "campos":campos
  }  : {
    "success":success,
    "message": message,
  }
}

export function verificarIdRequisicao(id:number|string, reply:FastifyReply){
  if(Number.isNaN(Number(id)))
    return reply.status(400).send(mensagemPadrao(false,'Insira um ID válido para fazer a requisição.'))
}

export function verificarZod(result,reply:FastifyReply){
  if(!result.success)
    return reply.status(400).send(mensagemPadrao(false,'Formulário preenchido incorretamente.',null,result.error.issues.map(err => err.message)))
}
export function verificarCorpoRequisicao(req,reply:FastifyReply){
  if(req.body == null || req.body == undefined)
    return reply.status(400).send(mensagemPadrao(false,'Insira um corpo válido para fazer a requisição.'))
}

export async function obterUsuarioPelasChavesUnicas(id:number,email='',cpf=''){
  return await prisma.usuarios.findFirst({
    where: {
      OR: [
        {id_usuario:Number(id)},
        {email:email},
        {cpf:cpf}
      ]
    },select:usuarioFields
  })
}


export async function obterEventoPelasChavesUnicas(id:number){
  return await prisma.eventos.findFirst({
    where: {
      id_evento: Number(id)
    },select:eventoFields
  })
}

export async function obterSetorPelasChavesUnicas(id:number){
  return await prisma.setores.findFirst({
    where: {
      id_setor: Number(id)
    },select:setorFields
  })
}

export async function obterClientePelasChavesUnicas(id:number,email:string='',cpf:string=''){
  return await prisma.clientes.findFirst({
    where: {
      OR:[
        {
          AND: {id_cliente:Number(id)}
        },
        {
          AND: {email:email}
        },
        {
          AND: {cpf:cpf}
        },
      ]
    },select:clienteFields
  })
}

export async function obterReservaPelasChavesUnicas(id:string){
  return await prisma.reservas.findFirst({
    where: {
      id_reserva:id
    },select:reservaFields
  })
}
