import { FastifyInstance } from "fastify";
import { criarReserva, deletarReserva, detalharReserva, editarReserva, obterReservas, validarReserva } from "../controllers/ReservaController";

export async function reservaRoutes(server:FastifyInstance) {
  server.get('',obterReservas)
  server.get('/:idReserva',detalharReserva)
  server.post('',criarReserva)
  server.put('/:idReserva/validar',validarReserva)
  server.put('/:idReserva',editarReserva)
  server.delete('/:idReserva',deletarReserva)
}