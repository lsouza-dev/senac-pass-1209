import { FastifyInstance } from "fastify";
import { criarUsuario, deletarUsuario, detalharUsuario, editarUsuario, obterUsuarios } from "../controllers/UsuarioController";

export async function usuarioRoutes(server:FastifyInstance) {
  server.get('',obterUsuarios)
  server.get('/:idUsuario',detalharUsuario)
  server.post('',criarUsuario)
  server.put('/:idUsuario',editarUsuario)
  server.delete('/:idUsuario',deletarUsuario)
}