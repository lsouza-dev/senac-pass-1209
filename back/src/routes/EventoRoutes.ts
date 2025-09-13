import { FastifyInstance } from "fastify";
import { criarEvento, deletarEvento, detalharEvento, editarEvento, obterEventos } from "../controllers/EventoController";

export async function eventoRoutes(server:FastifyInstance) {
  server.get('',obterEventos)
  server.get('/:idEvento',detalharEvento)
  server.post('',criarEvento)
  server.put('/:idEvento',editarEvento)
  server.delete('/:idEvento',deletarEvento)
}