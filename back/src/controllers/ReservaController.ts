import { FastifyReply, FastifyRequest } from "fastify";
import { mensagemPadrao, obterClientePelasChavesUnicas, obterEventoPelasChavesUnicas, obterReservaPelasChavesUnicas, obterSetorPelasChavesUnicas, obterUsuarioPelasChavesUnicas, prisma, verificarCorpoRequisicao, verificarIdRequisicao, verificarZod } from "../Util";
import {reservaCriacaoSchema,reservaEdicaoSchema,reservaFields,ReservaCriacaoDTO,ReservaEdicaoDTO} from '../schemas/ReservaSchema'


export async function obterReservas(req:FastifyRequest,reply:FastifyReply) {
  try{
    const reservas = await prisma.reservas.findMany({where:{ativo:true},select:reservaFields,orderBy:{}})
    return reply.status(200).send(mensagemPadrao(true,'Reservas encontrados',reservas))

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}

export async function detalharReserva(req:FastifyRequest<{Params:{idReserva:string}}>,reply:FastifyReply) {
  try{
    const {idReserva} = req.params
  
      const reservaExistente = await obterReservaPelasChavesUnicas(idReserva)

      if(reservaExistente){ 
        return reply.status(200).send(mensagemPadrao(true,'Reserva encontrado',reservaExistente))
      }
      return reply.status(404).send(mensagemPadrao(false,'Reserva não encontrado'))
        

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}

export async function criarReserva(req:FastifyRequest<{Body:ReservaCriacaoDTO}>,reply:FastifyReply) {
  try{
    verificarCorpoRequisicao(req,reply)
    const result = reservaCriacaoSchema.safeParse(req.body)
    verificarZod(result,reply)

    if(result.data){

      const cliente = await obterClientePelasChavesUnicas(result.data.id_cliente)
      const evento = await obterEventoPelasChavesUnicas(result.data.id_evento)
      const usuario = await obterUsuarioPelasChavesUnicas(result.data.id_usuario)
      const setor = await obterSetorPelasChavesUnicas(result.data.id_setor)
      
      console.log(setor);

      if(!cliente || !cliente.ativo) 
        return reply.status(404).send(mensagemPadrao(false,'O Cliente inserido não existe ou está inativo.'))
      if(!evento || !evento.ativo) 
        return reply.status(404).send(mensagemPadrao(false,'O Evento inserido não existe ou está inativo.'))
      if(!usuario || !usuario.ativo) 
        return reply.status(404).send(mensagemPadrao(false,'O Usuário inserido não existe ou está inativo.'))
      if(!setor || !setor.ativo) {
        return reply.status(404).send(mensagemPadrao(false,'O Setor inserido não existe ou está inativo.'))
      }

      const reservas = await prisma.reservas.findMany({
        where: {
          id_evento:evento.id_evento,
          id_setor:setor.id_setor,
          ativo:true,
        },select:reservaFields
      })
      
      console.log(reservas.length);

      if(reservas.length+1 == setor.capacidade_max)
        return reply.status(400).send(mensagemPadrao(false,'Não há mais ingressos disponíveis para este setor.'))

      const query = await prisma.$queryRawUnsafe<any []>(`SELECT COUNT(*)+1 as total FROM reservas`)
      const id = query[0].total
      
      result.data['id_reserva'] = `EVT${evento.id_evento}-S${setor.id_setor}-C${cliente.id_cliente}-${id}`
      const reserva = await prisma.reservas.create({
        data:result.data
        ,select:reservaFields})
      return reply.status(200).send(mensagemPadrao(true,'Reserva criado com sucesso',reserva))
    }      

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}

export async function editarReserva(req:FastifyRequest<{Body:ReservaEdicaoDTO,Params:{idReserva:string}}>,reply:FastifyReply) {
  try{
    const {idReserva} = req.params
    verificarCorpoRequisicao(req,reply)
    const result = reservaEdicaoSchema.safeParse(req.body)
    verificarZod(result,reply)
    if(result.data){
      let reserva = await obterReservaPelasChavesUnicas(idReserva)

      if(reserva){

        if(result.data.id_setor){
          const setor = await obterSetorPelasChavesUnicas(result.data.id_setor)
          if(setor){
            if(setor.ativo ){
              if(setor.id_evento !== reserva.id_evento)
                return reply.status(400).send(mensagemPadrao(false,'O setor inserido não pertence ao evento vinculado a reserva.'))
              if(setor.capacidade_atual < setor.capacidade_max){
                  await prisma.setores.update({
                    where: {id_setor: reserva.id_setor},
                    data:{capacidade_atual: reserva.setores.capacidade_atual - 1}
                  })
                  await prisma.setores.update({
                    where: {id_setor: setor.id_setor},
                    data:{capacidade_atual: setor.capacidade_atual + 1}
                  })
                  let reservaAtualizada =  await prisma.reservas.update({where:{id_reserva:idReserva},
                    data:result.data,select:reservaFields
                  })
                  return reply.status(200).send(mensagemPadrao(true,'Reserva editado com sucesso',reservaAtualizada))
              }else {
              return reply.status(404).send(mensagemPadrao(false,'O Setor inserido está lotado.'))
            }
            }else {
              return reply.status(404).send(mensagemPadrao(false,'O Setor inserido está inativo.'))
            }
          }else {
            return reply.status(404).send(mensagemPadrao(false,'O Setor inserido não existe.'))
          }
        }
      }else return reply.status(404).send(mensagemPadrao(false,'Reserva não encontrado'))
    }      

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}
export async function validarReserva(req:FastifyRequest<{Params:{idReserva:string}}>,reply:FastifyReply) {
  try{
    const {idReserva} = req.params
      let reserva = await obterReservaPelasChavesUnicas(idReserva)

      if(reserva){
          if(reserva.status === 'Validado')
            return reply.status(404).send(mensagemPadrao(false,'A reserva já foi validada.'))
          
          if(!reserva.ativo)
            return reply.status(404).send(mensagemPadrao(false,'A reserva está inativa.'))

          if(reserva.setores.capacidade_atual < reserva.setores.capacidade_max){
                  const setorAtualizado = await prisma.setores.update({
                    where: {id_setor: reserva.setores.id_setor},
                    data:{capacidade_atual: reserva.setores.capacidade_atual = reserva.setores.capacidade_atual + 1}
                  })

                  console.log(setorAtualizado);
                  let reservaValidada = await prisma.reservas.update({
            where: {id_reserva: reserva.id_reserva},
            data: {
              status: 'Validado',
              dt_validacao: new Date()
            }
          })

          return reply.status(200).send(mensagemPadrao(true,'Reserva validada com sucesso!',reservaValidada))
              }else {
              return reply.status(404).send(mensagemPadrao(false,'O Setor inserido está lotado.'))
              }
      }else return reply.status(404).send(mensagemPadrao(false,'Reserva não encontrado'))
    

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}


export async function deletarReserva(req:FastifyRequest<{Params:{idReserva:string}}>,reply:FastifyReply) {
  try{
    const {idReserva} = req.params
  
      const reservaExistente = await obterReservaPelasChavesUnicas(idReserva)

      if(reservaExistente){ 
        if(reservaExistente.status === 'Validado'){

          await prisma.setores.update({
            where: {id_setor: reservaExistente.id_setor},
            data: {capacidade_atual: reservaExistente.setores.capacidade_atual - 1}
          })
        }
        await prisma.reservas.update({where:{id_reserva:idReserva},data:{ativo:false}})
        return reply.status(200).send(mensagemPadrao(true,'Reserva excluido com sucesso'))
      }
      return reply.status(404).send(mensagemPadrao(false,'Reserva não encontrado'))
        

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}