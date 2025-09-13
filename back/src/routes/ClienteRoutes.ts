import { FastifyInstance } from "fastify";
import { criarCliente, deletarCliente, detalharCliente, editarCliente, obterClientes } from "../controllers/ClienteController";

export async function clienteRoutes(server:FastifyInstance) {
  server.get('',obterClientes)
  server.get('/:idCliente',detalharCliente)
  server.post('',criarCliente)
  server.put('/:idCliente',editarCliente)
  server.delete('/:idCliente',deletarCliente)
}