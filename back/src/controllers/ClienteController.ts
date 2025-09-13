import { FastifyReply, FastifyRequest } from "fastify";
import { mensagemPadrao, obterClientePelasChavesUnicas, prisma, verificarCorpoRequisicao, verificarIdRequisicao, verificarZod } from "../Util";
import {clienteCriacaoSchema,clienteEdicaoSchema,clienteFields,ClienteCriacaoDTO,ClienteEdicaoDTO} from '../schemas/ClienteSchema'

export async function obterClientes(req:FastifyRequest,reply:FastifyReply) {
  try{
    const clientes = await prisma.clientes.findMany({where:{ativo:true},select:clienteFields})
    return reply.status(200).send(mensagemPadrao(true,'Clientes encontrados',clientes))

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}

export async function detalharCliente(req:FastifyRequest<{Params:{idCliente:number}}>,reply:FastifyReply) {
  try{
    const {idCliente} = req.params
    verificarIdRequisicao(idCliente,reply)
  
      const clienteExistente = await obterClientePelasChavesUnicas(idCliente)

      if(clienteExistente){ 
        return reply.status(200).send(mensagemPadrao(true,'Cliente encontrado',clienteExistente))
      }
      return reply.status(404).send(mensagemPadrao(false,'Cliente não encontrado'))
        

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}

export async function criarCliente(req:FastifyRequest<{Body:ClienteCriacaoDTO}>,reply:FastifyReply) {
  try{
    verificarCorpoRequisicao(req,reply)
    const result = clienteCriacaoSchema.safeParse(req.body)
    verificarZod(result,reply)
    if(result.data){

      const clienteExistente = await obterClientePelasChavesUnicas(0,result.data.email,result.data.cpf)
      if(clienteExistente){
        if(clienteExistente.cpf === result.data.cpf)
          return reply.status(400).send(mensagemPadrao(false,'Já existe um cliente criado com o CPF informado.',))
        if(clienteExistente.email === result.data.email)
          return reply.status(400).send(mensagemPadrao(false,'Já existe um cliente criado com o Email informado.',))
      }

      const cliente = await prisma.clientes.create({data:result.data,select:clienteFields})
      return reply.status(200).send(mensagemPadrao(true,'Cliente criado com sucesso',cliente))
    }      

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}

export async function editarCliente(req:FastifyRequest<{Body:ClienteEdicaoDTO,Params:{idCliente:number}}>,reply:FastifyReply) {
  try{
    const {idCliente} = req.params
    verificarIdRequisicao(idCliente,reply)
    verificarCorpoRequisicao(req,reply)
    const result = clienteEdicaoSchema.safeParse(req.body)
    verificarZod(result,reply)
    if(result.data){

      const clienteExistente = await obterClientePelasChavesUnicas(0,result.data.email)
      if(clienteExistente){
        if(clienteExistente.id_cliente !== Number(idCliente) && clienteExistente.email === result.data.email)
          return reply.status(400).send(mensagemPadrao(false,'Já existe um cliente criado com o Email informado.',))
      }

      let cliente = await obterClientePelasChavesUnicas(idCliente)

      if(cliente){

        let clienteAtualizado =  await prisma.clientes.update({where:{id_cliente:Number(idCliente)},data:result.data,select:clienteFields})
        return reply.status(200).send(mensagemPadrao(true,'Cliente editado com sucesso',clienteAtualizado))
      }else return reply.status(404).send(mensagemPadrao(false,'Cliente não encontrado'))
    }      

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}


export async function deletarCliente(req:FastifyRequest<{Params:{idCliente:number}}>,reply:FastifyReply) {
  try{
    const {idCliente} = req.params
    verificarIdRequisicao(idCliente,reply)
  
      const clienteExistente = await obterClientePelasChavesUnicas(idCliente)

      if(clienteExistente){ 
        
        if(clienteExistente.reservas.length > 0){
          clienteExistente.reservas.forEach(async r => {
            await prisma.reservas.update({
              where: {id_reserva: r.id_reserva},
              data: {ativo:false}
            })
          })
        }
        await prisma.clientes.update({where:{id_cliente:Number(idCliente)},data:{ativo:false}})
        return reply.status(200).send(mensagemPadrao(true,'Cliente excluido com sucesso'))
      }
      return reply.status(404).send(mensagemPadrao(false,'Cliente não encontrado'))
        

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}