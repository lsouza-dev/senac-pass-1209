import { FastifyReply, FastifyRequest } from "fastify";
import { mensagemPadrao,prisma} from "../Util";

export async function obterPerfis(req:FastifyRequest,reply:FastifyReply) {
  try{
    const perfis = await prisma.perfis.findMany()
    return reply.status(200).send(mensagemPadrao(true,'Perfis encontrados',perfis))

  }catch(err){
    return reply.status(500).send(mensagemPadrao(false,'Erro inesperado:'+err.message))
  }
}
