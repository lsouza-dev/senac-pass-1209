import { FastifyReply, FastifyRequest } from "fastify";
import { mensagemPadrao, obterEventoPelasChavesUnicas, prisma, verificarCorpoRequisicao, verificarIdRequisicao, verificarZod } from "../Util";
import {eventoCriacaoSchema,eventoEdicaoSchema,eventoFields,EventoCriacaoDTO,EventoEdicaoDTO} from '../schemas/EventoSchema'


export async function obterEventos(req:FastifyRequest,reply:FastifyReply) {
  try{
    const eventos = await prisma.eventos.findMany({where:{ativo:true},select:eventoFields})
    return reply.status(200).send(mensagemPadrao(true,'Eventos encontrados',eventos))

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}

export async function detalharEvento(req:FastifyRequest<{Params:{idEvento:number}}>,reply:FastifyReply) {
  try{
    const {idEvento} = req.params
    verificarIdRequisicao(idEvento,reply)
  
      const eventoExistente = await obterEventoPelasChavesUnicas(idEvento)

      if(eventoExistente){ 
        return reply.status(200).send(mensagemPadrao(true,'Evento encontrado',eventoExistente))
      }
      return reply.status(404).send(mensagemPadrao(false,'Evento não encontrado'))
        

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}

export async function criarEvento(req:FastifyRequest<{Body:EventoCriacaoDTO}>,reply:FastifyReply) {
  try{
    verificarCorpoRequisicao(req,reply)
    const result = eventoCriacaoSchema.safeParse(req.body)
    verificarZod(result,reply)

    if(result.data){
      const evento = await prisma.eventos.create({
        data:{
            nome:result.data.nome,
            local:result.data.local,
            descricao:result.data.descricao,
            dt_inicio:new Date(result.data.dt_inicio),
            dt_fim:new Date(result.data.dt_fim),
            capacidade_max: result.data.capacidade_max,
        }
        ,select:eventoFields})
      return reply.status(200).send(mensagemPadrao(true,'Evento criado com sucesso',evento))
    }      

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}

export async function editarEvento(req:FastifyRequest<{Body:EventoEdicaoDTO,Params:{idEvento:number}}>,reply:FastifyReply) {
  try{
    const {idEvento} = req.params
    verificarIdRequisicao(idEvento,reply)
    verificarCorpoRequisicao(req,reply)
    const result = eventoEdicaoSchema.safeParse(req.body)
    verificarZod(result,reply)
    if(result.data){
      let evento = await obterEventoPelasChavesUnicas(idEvento)

      if(evento){
        evento =  await prisma.eventos.update({where:{id_evento:Number(idEvento)},
           data:{
            nome:result.data.nome,
            local:result.data.local,
            descricao:result.data.descricao,
            dt_inicio:result.data.dt_inicio && new Date(result.data.dt_inicio),
            dt_fim:result.data.dt_fim && new Date(result.data.dt_fim),
            capacidade_max: result.data.capacidade_max,
        },select:eventoFields})
        return reply.status(200).send(mensagemPadrao(true,'Evento editado com sucesso',evento))
      }else return reply.status(404).send(mensagemPadrao(false,'Evento não encontrado'))
    }      

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}


export async function deletarEvento(req:FastifyRequest<{Params:{idEvento:number}}>,reply:FastifyReply) {
  try{
    const {idEvento} = req.params
    verificarIdRequisicao(idEvento,reply)
  
      const eventoExistente = await obterEventoPelasChavesUnicas(idEvento)

      if(eventoExistente){ 
        if(eventoExistente.setores.length >0){
          eventoExistente.setores.forEach(async s => await prisma.setores.update({
            where:{id_setor:s.id_setor},
            data:{ativo:false}
          }))
        }
        await prisma.eventos.update({where:{id_evento:Number(idEvento)},data:{ativo:false}})
        return reply.status(200).send(mensagemPadrao(true,'Evento excluido com sucesso'))
      }
      return reply.status(404).send(mensagemPadrao(false,'Evento não encontrado'))
        

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}