import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { LoginDTO, loginSchema } from "../schemas/LoginSchema";
import { mensagemPadrao, obterUsuarioPelasChavesUnicas, prisma, verificarCorpoRequisicao, verificarZod } from "../Util";
import bcrypt from 'bcrypt'

export async function authRoutes(server:FastifyInstance) {
  server.post('/login',async (req:FastifyRequest<{Body: LoginDTO}>,reply:FastifyReply) => {
    verificarCorpoRequisicao(req,reply)
    const result = loginSchema.safeParse(req.body)
    verificarZod(result,reply)
    if(result.data){
      const usuario = await prisma.usuarios.findFirst(
        {
          where:{
            OR:[
              {
                AND:{
                  email: result.data.login
                }
              },
              {
                AND:{
                  cpf: result.data.login
                }
              },
            ]
          },
        },
      )
      if(usuario){  
        const senhaValida = await bcrypt.compare(result.data.senha,usuario.senha)
        
        if(senhaValida){
          const usuarioRetorno = await obterUsuarioPelasChavesUnicas(usuario.id_usuario) 
          return reply.status(200).send(mensagemPadrao(true,'Login feito com sucesso',usuarioRetorno))
        }else return reply.status(400).send(mensagemPadrao(false,'Senha incorreta.'))
      }else return reply.status(404).send(mensagemPadrao(false,'Usuário não encontrado.'))
    }
  })
}