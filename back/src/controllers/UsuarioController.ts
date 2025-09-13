import { FastifyReply, FastifyRequest } from "fastify";
import { mensagemPadrao, obterUsuarioPelasChavesUnicas, prisma, verificarCorpoRequisicao, verificarIdRequisicao, verificarZod } from "../Util";
import {usuarioCriacaoSchema,usuarioEdicaoSchema,usuarioFields,UsuarioCriacaoDTO,UsuarioEdicaoDTO} from '../schemas/UsuariosSchema'
import bcrypt from 'bcrypt'

export async function obterUsuarios(req:FastifyRequest,reply:FastifyReply) {
  try{
    const usuarios = await prisma.usuarios.findMany({where:{ativo:true},select:usuarioFields})
    return reply.status(200).send(mensagemPadrao(true,'Usuarios encontrados',usuarios))

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}

export async function detalharUsuario(req:FastifyRequest<{Params:{idUsuario:number}}>,reply:FastifyReply) {
  try{
    const {idUsuario} = req.params
    verificarIdRequisicao(idUsuario,reply)
  
      const usuarioExistente = await obterUsuarioPelasChavesUnicas(idUsuario)

      if(usuarioExistente){ 
        return reply.status(200).send(mensagemPadrao(true,'Usuario encontrado',usuarioExistente))
      }
      return reply.status(404).send(mensagemPadrao(false,'Usuario não encontrado'))
        

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}

export async function criarUsuario(req:FastifyRequest<{Body:UsuarioCriacaoDTO}>,reply:FastifyReply) {
  try{
    verificarCorpoRequisicao(req,reply)
    const result = usuarioCriacaoSchema.safeParse(req.body)
    verificarZod(result,reply)
    if(result.data){

      const usuarioExistente = await obterUsuarioPelasChavesUnicas(0,result.data.email,result.data.cpf)
      console.log(usuarioExistente);
      if(usuarioExistente){

        if(usuarioExistente.cpf === result.data.cpf)
          return reply.status(400).send(mensagemPadrao(false,'Já existe um usuario criado com o CPF informado.',))
        if(usuarioExistente.email === result.data.email)
          return reply.status(400).send(mensagemPadrao(false,'Já existe um usuario criado com o Email informado.',))
      }

      result.data.senha = await bcrypt.hash(result.data.senha,15)
      const usuario = await prisma.usuarios.create({data:result.data,select:usuarioFields})
      return reply.status(200).send(mensagemPadrao(true,'Usuario criado com sucesso',usuario))
    }      

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}

export async function editarUsuario(req:FastifyRequest<{Body:UsuarioEdicaoDTO,Params:{idUsuario:number}}>,reply:FastifyReply) {
  try{
    const {idUsuario} = req.params
    verificarIdRequisicao(idUsuario,reply)
    verificarCorpoRequisicao(req,reply)
    const result = usuarioEdicaoSchema.safeParse(req.body)
    verificarZod(result,reply)
    if(result.data){

      const usuarioExistente = await obterUsuarioPelasChavesUnicas(0,result.data.email)
      if(usuarioExistente){
        console.log(usuarioExistente)
        if(usuarioExistente.id_usuario !== Number(idUsuario) && usuarioExistente.email === result.data.email)
          return reply.status(400).send(mensagemPadrao(false,'Já existe um usuario criado com o Email informado.',))
      }

      if(result.data.senha) result.data.senha = await bcrypt.hash(result.data.senha,15)
      let usuario = await obterUsuarioPelasChavesUnicas(idUsuario)

      if(usuario){

        usuario =  await prisma.usuarios.update({where:{id_usuario:Number(idUsuario)},data:result.data,select:usuarioFields})
        return reply.status(200).send(mensagemPadrao(true,'Usuario editado com sucesso',usuario))
      }else return reply.status(404).send(mensagemPadrao(false,'Usuario não encontrado'))
    }      

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}


export async function deletarUsuario(req:FastifyRequest<{Params:{idUsuario:number}}>,reply:FastifyReply) {
  try{
    const {idUsuario} = req.params
    verificarIdRequisicao(idUsuario,reply)
  
      const usuarioExistente = await obterUsuarioPelasChavesUnicas(idUsuario)

      if(usuarioExistente){ 
        await prisma.usuarios.update({where:{id_usuario:Number(idUsuario)},data:{ativo:false}})
        return reply.status(200).send(mensagemPadrao(true,'Usuario excluido com sucesso'))
      }
      return reply.status(404).send(mensagemPadrao(false,'Usuario não encontrado'))
        

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}