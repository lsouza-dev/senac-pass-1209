import { FastifyInstance } from "fastify";
import { criarSetor, deletarSetor, detalharSetor, editarSetor, obterSetores, obterSetoresPorEvento } from "../controllers/SetorController";

export async function setorRoutes(server:FastifyInstance) {
  server.get('',obterSetores)
  server.get('/evento/:idEvento',obterSetoresPorEvento)
  server.get('/:idSetor',detalharSetor)
  server.post('',criarSetor)
  server.put('/:idSetor',editarSetor)
  server.delete('/:idSetor',deletarSetor)
}