import { FastifyReply, FastifyRequest } from "fastify";
import { mensagemPadrao, obterEventoPelasChavesUnicas, obterSetorPelasChavesUnicas, prisma, verificarCorpoRequisicao, verificarIdRequisicao, verificarZod } from "../Util";
import {setorCriacaoSchema,setorEdicaoSchema,setorFields,SetorCriacaoDTO,SetorEdicaoDTO} from '../schemas/SetorSchema'
import bcrypt from 'bcrypt'

export async function obterSetores(req:FastifyRequest,reply:FastifyReply) {
  try{
    const setores = await prisma.setores.findMany({where:{ativo:true},select:setorFields})
    return reply.status(200).send(mensagemPadrao(true,'Setor encontrados',setores))

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}
export async function obterSetoresPorEvento(req:FastifyRequest<{Params:{idEvento:number}}>,reply:FastifyReply) {
  try{
    const {idEvento} = req.params
    verificarIdRequisicao(idEvento,reply)

    const setores = await prisma.setores.findMany({where:{ativo:true,id_evento:Number(idEvento)},select:setorFields})
    return reply.status(200).send(mensagemPadrao(true,'Setor encontrados',setores))

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}

export async function detalharSetor(req:FastifyRequest<{Params:{idSetor:number}}>,reply:FastifyReply) {
  try{
    const {idSetor} = req.params
    verificarIdRequisicao(idSetor,reply)
  
      const setorExistente = await obterSetorPelasChavesUnicas(idSetor)

      if(setorExistente){ 
        return reply.status(200).send(mensagemPadrao(true,'Setor encontrado',setorExistente))
      }
      return reply.status(404).send(mensagemPadrao(false,'Setor não encontrado'))
        

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}

export async function criarSetor(req:FastifyRequest<{Body:SetorCriacaoDTO}>,reply:FastifyReply) {
  try{
    verificarCorpoRequisicao(req,reply)
    const result = setorCriacaoSchema.safeParse(req.body)
    verificarZod(result,reply)

    if(result.data){

      let setorExistente = await prisma.setores.findFirst({
        where:{nome:result.data.nome,id_evento:result.data.id_evento,ativo:true},
        select:setorFields
      })

      if(setorExistente)
        return reply.status(400).send(mensagemPadrao(false,'Já existe um setor com esse nome vinculado o evento.'))

      const evento = await obterEventoPelasChavesUnicas(result.data.id_evento)
      if(evento && evento.ativo){
  
        const totalSetoresEvento = evento.setores.reduce((acc,s) => acc = acc + (s.ativo ? s.capacidade_max : 0),0)
        if(totalSetoresEvento+result.data.capacidade_max > evento.capacidade_max){
          return reply.status(400).send(mensagemPadrao(false,`Não foi possível criar o setor.A quantidade disponível para o evento é de ${evento.capacidade_max-totalSetoresEvento}.`))
        }
        const setor = await prisma.setores.create({
          data:result.data
          ,select:setorFields})
          return reply.status(200).send(mensagemPadrao(true,'Setor criado com sucesso',setor))
        }else {
          return reply.status(404).send(mensagemPadrao(false,'O Evento inserido não existe ou está inativo.'))
        }
    }      

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}

export async function editarSetor(req:FastifyRequest<{Body:SetorEdicaoDTO,Params:{idSetor:number}}>,reply:FastifyReply) {
  try{
    const {idSetor} = req.params
    verificarIdRequisicao(idSetor,reply)
    verificarCorpoRequisicao(req,reply)
    const result = setorEdicaoSchema.safeParse(req.body)
    verificarZod(result,reply)
    if(result.data){
      let setor = await obterSetorPelasChavesUnicas(idSetor)
      if(setor){
        const evento = await obterEventoPelasChavesUnicas(setor.id_evento)

      if(evento && evento.ativo){

        console.log(idSetor);
        evento.setores.forEach(e => console.log(e))
        const totalSetoresEvento = evento.setores.reduce((acc,s) => acc = acc + (s.ativo ? s.capacidade_max : 0) ,0)

        console.log(evento.capacidade_max);
        console.log(totalSetoresEvento);

        if(result.data.capacidade_max){
          if((totalSetoresEvento-setor.capacidade_max)+result.data.capacidade_max! > evento.capacidade_max){
            return reply.status(400).send(mensagemPadrao(false,`Não foi possível criar o setor.A quantidade disponível para o evento é de ${evento.capacidade_max - (totalSetoresEvento - setor.capacidade_max)}.`))
          }
        }
        const setorAtualizado = await prisma.setores.update({
          where:{id_setor:Number(idSetor)},
          data:result.data
          ,select:setorFields})
          return reply.status(200).send(mensagemPadrao(true,'Setor criado com sucesso',setorAtualizado))
        }else {
          return reply.status(404).send(mensagemPadrao(false,'O Evento inserido não existe ou está inativo.'))
        }


      }else return reply.status(404).send(mensagemPadrao(false,'Setor não encontrado'))
    }      

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}


export async function deletarSetor(req:FastifyRequest<{Params:{idSetor:number}}>,reply:FastifyReply) {
  try{
    const {idSetor} = req.params
    verificarIdRequisicao(idSetor,reply)
  
      const setorExistente = await obterSetorPelasChavesUnicas(idSetor)

      if(setorExistente){ 
        await prisma.setores.update({where:{id_setor:Number(idSetor)},data:{ativo:false}})
        return reply.status(200).send(mensagemPadrao(true,'Setor excluido com sucesso'))
      }
      return reply.status(404).send(mensagemPadrao(false,'Setor não encontrado'))
        

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}